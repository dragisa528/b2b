import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Alert,
} from '@mui/material'

import {
  useEffect,
  useState,
} from 'react'

import styled from '@emotion/styled'

import {
  Delete,
} from '@mui/icons-material'

import {
  snackbar,
} from '@/utils'
import {
  createCart,
  getCartInfo,
  addProductToCart,
} from '@/shared/service/bc'
import {
  useMobile,
} from '@/hooks'

import {
  B3Dialog,
  B3Sping,
  B3LinkTipContent,
} from '@/components'

import {
  ProductsProps,
  addlineItems,
  getProductOptionsFields,
} from '../shared/config'

interface successTipOptions{
  message: string,
  link?: string,
  linkText?: string,
  isOutLink?: boolean,
}

const successTip = (options: successTipOptions) => () => (
  <B3LinkTipContent
    message={options.message}
    link={options.link}
    linkText={options.linkText}
    isOutLink={options.isOutLink}
  />
)

interface ShoppingProductsProps {
  products: ProductsProps[],
  currencyToken: string,
  successProducts: number,
  getProductQuantity?: (item: ProductsProps) => number
  onProductChange?: (products: ProductsProps[]) => void
  setValidateFailureProducts: (arr: ProductsProps[]) => void,
  setValidateSuccessProducts: (arr: ProductsProps[]) => void,
}

interface FlexProps {
  isHeader?: boolean,
  isMobile?: boolean,
}

interface FlexItemProps {
  width?: string,
  padding?: string,
  flexBasis?: string,
  flexDirection?: 'column' | 'inherit' | '-moz-initial' | 'initial' | 'revert' | 'unset' | 'column-reverse' | 'row' | 'row-reverse',
}

const Flex = styled('div')(({
  isHeader,
  isMobile,
}: FlexProps) => {
  const headerStyle = isHeader ? {
    borderBottom: '1px solid #D9DCE9',
    paddingBottom: '8px',
    alignItems: 'center',
  } : {
    alignItems: 'flex-start',
  }

  const mobileStyle = isMobile ? {
    borderTop: '1px solid #D9DCE9',
    padding: '12px 0 12px',
    '&:first-of-type': {
      marginTop: '12px',
    },
  } : {}

  const flexWrap = isMobile ? 'wrap' : 'initial'

  return {
    display: 'flex',
    wordBreak: 'break-word',
    padding: '8px 0 0',
    gap: '8px',
    flexWrap,
    ...headerStyle,
    ...mobileStyle,
  }
})

const FlexItem = styled('div')(({
  width,
  padding = '0',
  flexBasis,
  flexDirection = 'row',
}: FlexItemProps) => ({
  display: 'flex',
  flexDirection,
  flexGrow: width ? 0 : 1,
  flexShrink: width ? 0 : 1,
  alignItems: 'flex-start',
  flexBasis,
  width,
  padding,
}))

const ProductHead = styled('div')(() => ({
  fontSize: '0.875rem',
  lineHeight: '1.5',
  color: '#263238',
}))

const ProductImage = styled('img')(() => ({
  width: '60px',
  borderRadius: '4px',
  flexShrink: 0,
}))

const defaultItemStyle = {
  default: {
    width: '80px',
  },
  qty: {
    width: '80px',
  },
  delete: {
    width: '30px',
  },
}

const mobileItemStyle = {
  default: {
    width: '100%',
    padding: '0 0 0 76px',
  },
  qty: {
    width: '100%',
    padding: '0 0 0 76px',
  },
  delete: {
    width: '100%',
    padding: '0 0 0 76px',
    display: 'flex',
    flexDirection: 'row-reverse',
  },
}

const defaultProductImage = 'https://cdn11.bigcommerce.com/s-1i6zpxpe3g/stencil/cd9e3830-4c73-0139-8a51-0242ac11000a/e/4fe76590-73f1-0139-3767-32e4ea84ca1d/img/ProductDefault.gif'

export const ReAddToCart = (props: ShoppingProductsProps) => {
  const {
    products,
    currencyToken,
    successProducts,
    setValidateFailureProducts,
    setValidateSuccessProducts,
  } = props

  const [isOpen, setOpen] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)

  const [isMobile] = useMobile()

  useEffect(() => {
    if (products.length > 0) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [products])

  const itemStyle = isMobile ? mobileItemStyle : defaultItemStyle

  const handleUpdateProductQty = (index: number, value: number | string) => {
    const newProduct: ProductsProps[] = [...products]
    newProduct[index].node.quantity = value
    setValidateFailureProducts(newProduct)
  }

  const handleCancelClicked = () => {
    setOpen(false)
    setValidateFailureProducts([])
    setValidateSuccessProducts([])
  }

  const deleteProduct = (index: number) => {
    const newProduct: ProductsProps[] = [...products]
    newProduct.splice(index, 1)
    setValidateFailureProducts(newProduct)
  }

  const validateRule = (product: ProductsProps) => {
    const {
      maxQuantity = 0,
      minQuantity = 0,
      stock = 0,
      node,
      isStock = '0',
    } = product
    const {
      quantity,
    } = node

    if (isStock === '1' && quantity > stock) return 'Out of stock'

    if (minQuantity !== 0 && quantity < minQuantity) return `Min Quantity ${minQuantity}`

    if (maxQuantity !== 0 && quantity > maxQuantity) return `Max Quantity ${maxQuantity}`

    return ''
  }

  const handRightClick = async () => {
    const isValidate = products.every((item: ProductsProps) => {
      if (validateRule(item)) return false
      return true
    })

    if (!isValidate) {
      snackbar.error('Please fill in the correct quantity')
      return
    }
    try {
      setLoading(true)

      const lineItems = addlineItems(products)
      const cartInfo = await getCartInfo()
      let res
      if (cartInfo.length > 0) {
        res = await addProductToCart({
          lineItems,
        }, cartInfo[0].id)
      } else {
        res = await createCart({
          lineItems,
        })
      }
      if (res.status === 422) {
        snackbar.error(res.detail)
      } else {
        handleCancelClicked()
        snackbar.success('', {
          jsx: successTip({
            message: 'Products were added to cart',
            link: '/cart.php',
            linkText: 'VIEW CART',
            isOutLink: true,
          }),
          isClose: true,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClearNoStock = () => {
    const newProduct = products.filter((item: ProductsProps) => item.isStock === '0' || item.stock !== 0)
    setValidateFailureProducts(newProduct)
  }

  return (
    <B3Dialog
      isOpen={isOpen}
      handleLeftClick={handleCancelClicked}
      handRightClick={handRightClick}
      title="Add to cart"
      rightSizeBtn="Add to cart"
      maxWidth="xl"
    >
      <Grid>
        <Box
          sx={{
            m: '0 0 1rem 0',
          }}
        >
          <Alert
            variant="filled"
            severity="success"
          >
            {`${successProducts} product(s) were added to cart`}
          </Alert>
        </Box>

        <Box
          sx={{
            m: '1rem 0',
          }}
        >
          <Alert
            variant="filled"
            severity="error"
          >
            {`${products.length} product(s) were not added to cart, please change the quantity`}
          </Alert>
        </Box>
        <B3Sping
          isSpinning={loading}
          size={16}
          isFlex={false}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '0.5rem 0 1rem 0',
            }}
          >
            <Box
              sx={{
                fontSize: '24px',
              }}
            >
              {`${products.length} products`}
            </Box>
            <Button onClick={() => handleClearNoStock()}> Adjust quantity</Button>
          </Box>

          {
            products.length > 0 ? (
              <Box>
                {
                  !isMobile && (
                  <Flex
                    isHeader
                    isMobile={isMobile}
                  >
                    <FlexItem flexBasis="100px">
                      <ProductHead>Product</ProductHead>
                    </FlexItem>
                    <FlexItem {...itemStyle.default}>
                      <ProductHead>Price</ProductHead>
                    </FlexItem>
                    <FlexItem {...itemStyle.qty}>
                      <ProductHead>Qty</ProductHead>
                    </FlexItem>
                    <FlexItem {...itemStyle.default}>
                      <ProductHead>Total</ProductHead>
                    </FlexItem>
                    <FlexItem {...itemStyle.delete}>
                      <ProductHead> </ProductHead>
                    </FlexItem>
                  </Flex>
                  )
                }
                {
                  products.map((product: ProductsProps, index: number) => {
                    const {
                      basePrice,
                      quantity,
                      primaryImage,
                      productName,
                      variantSku,
                      optionList,
                      productsSearch,
                      // productsSearch: {
                      //   variants,
                      // },
                      // variantId,
                    } = product.node
                    const total = +basePrice * +quantity
                    const price = +basePrice

                    // const newOptionList = JSON.parse(optionList)
                    // let optionsValue = []
                    // if (newOptionList.length > 0) {
                    //   const newVariant = variants.find((item:CustomFieldItems) => +item.variant_id
                    //   === +variantId || +item.id === +variantId)

                    //   optionsValue = newVariant?.option_values || []
                    // }

                    const newProduct: any = {
                      ...productsSearch,
                      selectOptions: optionList,
                    }

                    const productFields = (getProductOptionsFields(newProduct, {}))

                    const newOptionList = JSON.parse(optionList)
                    const optionsValue: CustomFieldItems[] = productFields.filter((item) => item.valueText)

                    return (
                      <Flex
                        isMobile={isMobile}
                        key={variantSku}
                      >
                        <FlexItem flexBasis="100px">
                          <ProductImage src={primaryImage || defaultProductImage} />
                          <Box
                            sx={{
                              marginLeft: '16px',
                            }}
                          >
                            <Typography
                              variant="body1"
                              color="#212121"
                            >
                              {productName}
                            </Typography>
                            <Typography
                              variant="body1"
                              color="#616161"
                            >
                              {variantSku}
                            </Typography>
                            {
                              newOptionList.length > 0 && optionsValue.length > 0 && optionsValue.map((option: CustomFieldItems) => (
                                <Typography
                                  sx={{
                                    fontSize: '0.75rem',
                                    lineHeight: '1.5',
                                    color: '#455A64',
                                  }}
                                  key={option.valueLabel}
                                >
                                  {`${option.valueLabel
                                  }: ${option.valueText}`}
                                </Typography>
                              ))
                            }
                          </Box>
                        </FlexItem>
                        <FlexItem
                          {...itemStyle.default}
                        >
                          {isMobile && <span>Price: </span>}
                          {`${currencyToken}${price.toFixed(2)}`}
                        </FlexItem>
                        <FlexItem {...itemStyle.qty}>
                          <TextField
                            type="number"
                            hiddenLabel={!isMobile}
                            variant="filled"
                            label={isMobile ? 'Qty' : ''}
                            value={quantity}
                            inputProps={{
                              inputMode: 'numeric', pattern: '[0-9]*',
                            }}
                            onChange={(e) => {
                              handleUpdateProductQty(index, e.target.value)
                            }}
                            error={!!validateRule(product)}
                            helperText={validateRule(product)}
                            size="small"
                            sx={{
                              width: isMobile ? '60%' : '100%',
                              '& .MuiFormHelperText-root': {
                                marginLeft: '0',
                                marginRight: '0',
                              },
                            }}
                          />
                        </FlexItem>
                        <FlexItem
                          {...itemStyle.default}
                        >
                          {isMobile && <div>Total: </div>}
                          {`${currencyToken}${total.toFixed(2)}`}
                        </FlexItem>

                        <FlexItem
                          {...itemStyle.delete}
                        >
                          <Delete
                            sx={{
                              cursor: 'pointer',
                              color: 'rgba(0, 0, 0, 0.54)',
                            }}
                            onClick={() => { deleteProduct(index) }}
                          />
                        </FlexItem>
                      </Flex>
                    )
                  })
                }
              </Box>
            ) : <></>
          }

        </B3Sping>

      </Grid>

    </B3Dialog>
  )
}
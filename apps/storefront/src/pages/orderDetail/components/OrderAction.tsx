import { Fragment, ReactNode, useContext, useState } from 'react'
import styled from '@emotion/styled'
import { Card, CardContent, Typography } from '@mui/material'
import { format } from 'date-fns'
import { throttle } from 'lodash'

import { CustomButton } from '@/components'
import { GlobaledContext } from '@/shared/global'
import { b2bPrintInvoice, snackbar } from '@/utils'

import { Address, OrderCurrency, OrderProductItem } from '../../../types'
import {
  OrderDetailsContext,
  OrderDetailsState,
} from '../context/OrderDetailsContext'

import OrderDialog from './OrderDialog'

const OrderActionContainer = styled('div')(() => ({}))

/// orderCard
const InformationContainer = styled('div')(() => ({
  background: '#F5F5F5',
  padding: '1rem',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '4px',
  marginTop: '0.5rem',
}))

const OrderCardHeader = styled(Typography)(() => ({
  padding: '1rem 0 0 1rem',
}))

const StyledCardActions = styled('div')(() => ({
  flexWrap: 'wrap',
  padding: '0 1rem 1rem 1rem',

  '& button': {
    marginLeft: '0',
    marginRight: '8px',
    margin: '8px 8px 0 0',
  },
}))

interface ItemContainerProps {
  nameKey: string
}

const ItemContainer = styled('div')((props: ItemContainerProps) => ({
  display: 'flex',
  justifyContent: 'space-between',
  fontWeight: props.nameKey === 'Grand total' ? 700 : 400,

  '& p': {
    marginTop: 0,
  },
}))

interface PaymentItemContainerProps {
  isAddMarginButton: boolean
}

const PaymentItemContainer = styled('div')(
  (props: PaymentItemContainerProps) => ({
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 400,
    marginBottom: props.isAddMarginButton ? '0.8rem' : '',
  })
)

interface Infos {
  info: {
    [k: string]: string
  }
  money?: OrderCurrency
}

interface Buttons {
  value: string
  key: string
  name: string
  variant?: 'text' | 'contained' | 'outlined'
  isCanShow: boolean
}

interface OrderCardProps {
  header: string
  subtitle: string
  buttons: Buttons[]
  infos: Infos | string
  products: OrderProductItem[]
  itemKey: string
  orderId: string
  currencyInfo: OrderCurrency
  role: number | string
}

interface DialogData {
  dialogTitle: string
  type: string
  description: string
  confirmText: string
}

function OrderCard(props: OrderCardProps) {
  const {
    header,
    subtitle,
    buttons,
    infos,
    products,
    itemKey,
    orderId,
    currencyInfo,
    role,
  } = props

  const {
    state: { isAgenting },
  } = useContext(GlobaledContext)

  const dialogData = [
    {
      dialogTitle: 'Re-order',
      type: 'reOrder',
      description: 'Select products and quantity for reorder',
      confirmText: 'Add to cart',
    },
    {
      dialogTitle: 'Return',
      type: 'return',
      description: 'Select products and quantity for return',
      confirmText: 'Submit return request',
    },
    {
      dialogTitle: 'Add to shopping list',
      type: 'shoppingList',
      description: 'Select products and quantity to add to shopping list',
      confirmText: 'Add to shopping list',
    },
  ]

  const [open, setOpen] = useState<boolean>(false)
  const [type, setType] = useState<string>('')
  const [currentDialogData, setCurrentDialogData] = useState<DialogData>()

  let infoKey: string[] = []
  let infoValue: string[] = []
  if (typeof infos !== 'string') {
    const { info } = infos

    infoKey = Object.keys(info)
    infoValue = Object.values(info)
  }

  const handleOpenDialog = (name: string) => {
    if (name === 'viewInvoice') {
      b2bPrintInvoice(orderId, 'b2b_print_invoice')
    } else if (name === 'printInvoice') {
      window.open(`/account.php?action=print_invoice&order_id=${orderId}`)
    } else {
      if (!isAgenting && +role === 3) {
        snackbar.error(
          'To re-order, return or add product to shopping list, please masquerade'
        )
        return
      }
      setOpen(true)
      setType(name)

      const newDialogData = dialogData.find(
        (data: DialogData) => data.type === name
      )
      setCurrentDialogData(newDialogData)
    }
  }

  let showedInformation: ReactNode[] | string = infoValue?.map(
    (value: string, index: number) => (
      <PaymentItemContainer
        key={value}
        isAddMarginButton={
          infoKey[index] === 'paymentMethod' || infoKey[index] === 'company'
        }
      >
        {value}
      </PaymentItemContainer>
    )
  )

  if (typeof infos === 'string') {
    showedInformation = infos
  } else if (infos.money) {
    showedInformation = infoKey?.map((key: string, index: number) => (
      <ItemContainer key={key} nameKey={key}>
        <p>{key}</p>
        <p>{`${infos.money?.currency_token}${infoValue[index]}`}</p>
      </ItemContainer>
    ))
  }

  return (
    <Card
      sx={{
        marginBottom: '1rem',
      }}
    >
      <OrderCardHeader variant="h5">{header}</OrderCardHeader>
      <CardContent>
        {subtitle && <div>{subtitle}</div>}
        <InformationContainer>{showedInformation}</InformationContainer>
      </CardContent>
      <StyledCardActions>
        {buttons &&
          buttons.map((button: Buttons) => (
            <Fragment key={button.key}>
              {button.isCanShow && (
                <CustomButton
                  value={button.value}
                  key={button.key}
                  name={button.name}
                  variant={button.variant}
                  onClick={throttle(() => {
                    handleOpenDialog(button.name)
                  }, 2000)}
                >
                  {button.value}
                </CustomButton>
              )}
            </Fragment>
          ))}
      </StyledCardActions>

      <OrderDialog
        open={open}
        products={products}
        currentDialogData={currentDialogData}
        type={type}
        setOpen={setOpen}
        itemKey={itemKey}
        currencyInfo={currencyInfo}
      />
    </Card>
  )
}

interface OrderActionProps {
  detailsData: OrderDetailsState
}

interface OrderData {
  header: string
  key: string
  subtitle: string
  buttons: Buttons[]
  infos: Infos | string
}

export default function OrderAction(props: OrderActionProps) {
  const { detailsData } = props
  const {
    state: { isB2BUser, role, emailAddress },
  } = useContext(GlobaledContext)

  const {
    state: { addressLabelPermission, createdEmail },
  } = useContext(OrderDetailsContext)

  const {
    money,
    orderSummary: { createAt, name, priceData } = {},
    payment: { updatedAt, billingAddress, paymentMethod } = {},
    orderComments = '',
    products,
    orderId,
    ipStatus = 0,
    canReturn = false,
  } = detailsData

  if (!orderId) {
    return null
  }

  const getCompanyName = (company: string) => {
    if (addressLabelPermission) {
      return company
    }

    const index = company.indexOf('/')

    return company.substring(index + 1, company.length)
  }

  const getFullPaymentAddress = (billingAddress?: Address) => {
    if (!billingAddress) {
      return {}
    }
    const {
      first_name: firstName,
      last_name: lastName,
      company,
      street_1: street1,
      state,
      zip,
      country,
      city,
    } = billingAddress || {}
    const paymentAddress = {
      paymentMethod: `Payment by ${paymentMethod}`,
      name: `${firstName} ${lastName}`,
      company: getCompanyName(company),
      street: street1,
      address: `${city}, ${state} ${zip}, ${country}`,
    }

    return paymentAddress
  }

  const handleOrderComments = (value: string) => {
    const commentsArr = value.split(/\n/g)

    const comments: {
      [k: string]: string
    } = {}

    commentsArr.forEach((item, index) => {
      if (item.trim().length > 0) {
        const isHaveTitle = item.trim().includes(':')

        const message = isHaveTitle ? item : `Comments: ${item}`

        comments[`mes${index}`] = message
      }
    })

    return comments
  }

  const buttons: Buttons[] = [
    {
      value: 'Re-Order',
      key: 'Re-Order',
      name: 'reOrder',
      variant: 'outlined',
      isCanShow: +role !== 2,
    },
    {
      value: 'Return',
      key: 'Return',
      name: 'return',
      variant: 'outlined',
      isCanShow: canReturn,
    },
    {
      value: 'ADD TO SHOPPING LIST',
      key: 'add-to-shopping-list',
      name: 'shoppingList',
      variant: 'outlined',
      isCanShow: true,
    },
  ]

  const orderData: OrderData[] = [
    {
      header: 'Summary',
      key: 'order-summary',
      subtitle:
        updatedAt && name
          ? `Purchased by ${name} on ${format(
              +updatedAt * 1000,
              'dd MMM yyyy'
            )}.`
          : '',
      buttons,
      infos: {
        money,
        info: priceData || {},
      },
    },
    {
      header: 'Payment',
      key: 'payment',
      subtitle: createAt
        ? `Paid in full on ${format(Date.parse(createAt), 'dd MMM yyyy')}.`
        : '',
      buttons: [
        {
          value: isB2BUser ? 'view invoice' : 'print invoice',
          key: 'aboutInvoice',
          name: isB2BUser ? 'viewInvoice' : 'printInvoice',
          variant: 'outlined',
          isCanShow:
            (!isB2BUser || +ipStatus !== 0) && createdEmail === emailAddress,
        },
      ],
      infos: {
        info: getFullPaymentAddress(billingAddress),
      },
    },
    {
      header: 'Order comments',
      key: 'order-comments',
      subtitle: '',
      buttons: [],
      infos: {
        info: handleOrderComments(orderComments),
      },
    },
  ]

  return (
    <OrderActionContainer>
      {orderData &&
        orderData.map((item: OrderData) => (
          <OrderCard
            products={products!}
            orderId={orderId.toString()}
            currencyInfo={money!}
            {...item}
            itemKey={item.key}
            role={role}
          />
        ))}
    </OrderActionContainer>
  )
}

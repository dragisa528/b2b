import { useB3Lang } from '@b3/lang'
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'

import { store } from '@/store'
import { currencyFormat } from '@/utils'

interface Summary {
  originalSubtotal: string | number
  discount: string | number
  tax: string | number
  shipping: string | number
  totalAmount: string | number
}

interface QuoteDetailSummaryProps {
  quoteSummary: Summary
  quoteDetailTax: number
  status: string
  quoteDetail: CustomFieldItems
}

export default function QuoteDetailSummary(props: QuoteDetailSummaryProps) {
  const b3Lang = useB3Lang()
  const {
    quoteSummary: { originalSubtotal, discount, tax, shipping, totalAmount },
    quoteDetailTax = 0,
    status,
    quoteDetail,
  } = props

  const {
    global: { enteredInclusive: enteredInclusiveTax, showInclusiveTaxPrice },
  } = store.getState()

  const subtotalPrice = +originalSubtotal
  const quotedSubtotal = +originalSubtotal - +discount

  const getCurrentPrice = (price: number, quoteDetailTax: number) => {
    if (enteredInclusiveTax) {
      return showInclusiveTaxPrice ? price : price - quoteDetailTax
    }
    return showInclusiveTaxPrice ? price + quoteDetailTax : price
  }

  const priceFormat = (price: number) => `${currencyFormat(price)}`

  return (
    <Card>
      <CardContent>
        <Box>
          <Typography variant="h5">
            {b3Lang('quoteDetail.summary.quoteSummary')}
          </Typography>
          <Box
            sx={{
              marginTop: '20px',
              color: '#212121',
            }}
          >
            <Grid
              container
              justifyContent="space-between"
              sx={{
                margin: '4px 0',
              }}
            >
              <Typography>
                {b3Lang('quoteDetail.summary.originalSubtotal')}
              </Typography>
              <Typography>
                {priceFormat(getCurrentPrice(subtotalPrice, quoteDetailTax))}
              </Typography>
            </Grid>
            <Grid
              container
              justifyContent="space-between"
              sx={{
                margin: '4px 0',
              }}
            >
              <Typography>
                {b3Lang('quoteDetail.summary.discountAmount')}
              </Typography>
              <Typography>
                {+discount > 0
                  ? `-${priceFormat(+discount)}`
                  : priceFormat(+discount)}
              </Typography>
            </Grid>
            <Grid
              container
              justifyContent="space-between"
              sx={{
                margin: '4px 0',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 'bold',
                  color: '#212121',
                }}
              >
                {b3Lang('quoteDetail.summary.quotedSubtotal')}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 'bold',
                  color: '#212121',
                }}
              >
                {priceFormat(getCurrentPrice(quotedSubtotal, quoteDetailTax))}
              </Typography>
            </Grid>
            {quoteDetail?.shippingMethod?.id ? (
              <>
                <Grid
                  container
                  justifyContent="space-between"
                  sx={{
                    margin: '4px 0',
                  }}
                >
                  <Typography
                    sx={{
                      maxWidth: '70%',
                      wordBreak: 'break-word',
                    }}
                  >
                    {`${b3Lang('quoteDetail.summary.shipping')}(${
                      quoteDetail?.shippingMethod?.description || ''
                    })`}
                  </Typography>
                  <Typography>{priceFormat(+shipping)}</Typography>
                </Grid>
                <Grid
                  container
                  justifyContent="space-between"
                  sx={{
                    margin: '4px 0',
                  }}
                >
                  <Typography>{b3Lang('quoteDetail.summary.tax')}</Typography>
                  <Typography>{priceFormat(+tax)}</Typography>
                </Grid>
              </>
            ) : null}

            {quoteDetail?.salesRepEmail &&
            !quoteDetail?.shippingMethod?.id &&
            (+status === 1 || +status === 5) ? (
              <>
                <Grid
                  container
                  justifyContent="space-between"
                  sx={{
                    margin: '4px 0',
                    flexWrap: 'nowrap',
                  }}
                >
                  <Typography>
                    {`${b3Lang('quoteDetail.summary.shipping')}(${b3Lang(
                      'quoteDetail.summary.quoteCheckout'
                    )})`}
                  </Typography>
                  <Typography>TBD</Typography>
                </Grid>
                <Grid
                  container
                  justifyContent="space-between"
                  sx={{
                    margin: '4px 0',
                  }}
                >
                  <Typography>{b3Lang('quoteDetail.summary.tax')}</Typography>
                  <Typography>TBD</Typography>
                </Grid>
              </>
            ) : null}
            <Grid
              container
              justifyContent="space-between"
              sx={{
                margin: '24px 0 0',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 'bold',
                  color: '#212121',
                }}
              >
                {b3Lang('quoteDetail.summary.grandTotal')}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 'bold',
                  color: '#212121',
                }}
              >
                {priceFormat(+totalAmount)}
              </Typography>
            </Grid>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

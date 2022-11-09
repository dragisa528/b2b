import {
  useState,
  useRef,
  useEffect,
} from 'react'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  MenuList,
  Button,
  MenuItem,
  ListItemText,
} from '@mui/material'

import styled from '@emotion/styled'

import {
  useMobile,
} from '@/hooks'

import {
  getB2BShoppingList,
} from '@/shared/service/b2b'

const ShoppingListMenuItem = styled(MenuItem)(() => ({
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
  },
  '&.active': {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
  },
}))

interface orderShoppingListProps {
  isOpen: boolean,
  dialogTitle?: string,
  confirmText?: string,
  onClose?: () => void,
  onCreate?: () => void,
  onConfirm?: (id: string) => void,
}

const noop = () => {}

export const OrderShoppingList = (props: orderShoppingListProps) => {
  const {
    isOpen,
    dialogTitle = 'Confirm',
    confirmText = 'OK',
    onClose = noop,
    onConfirm = noop,
    onCreate = noop,
  } = props

  const container = useRef<HTMLInputElement | null>(null)
  const [isMobile] = useMobile()

  const [list, setList] = useState([])
  const [activeId, setActiveId] = useState('')

  const getList = async () => {
    const {
      shoppingLists: {
        edges: list = [],
      },
    }: any = await getB2BShoppingList()

    setList(list)
  }

  useEffect(() => {
    if (isOpen) {
      getList()
    }
  }, [isOpen])

  const handleClose = () => {
    onClose()
  }

  const handleConfirm = () => {
    onConfirm(activeId)
  }

  const handleCreate = () => {
    onCreate()
  }

  const handleListItemClicked = (item: any) => () => {
    setActiveId(item.node.id)
  }

  return (
    <Box>
      <Box
        ref={container}
      />
      <Dialog
        open={isOpen}
        fullWidth
        container={container.current}
        onClose={handleClose}
        fullScreen={isMobile}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            borderBottom: '1px solid #D9DCE9',
          }}
        >
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <MenuList>
            {
            list.map((item: any) => (
              <ShoppingListMenuItem
                className={activeId === item.node.id ? 'active' : ''}
                onClick={handleListItemClicked(item)}
              >
                <ListItemText>{item.node.name}</ListItemText>
              </ShoppingListMenuItem>
            ))
          }
          </MenuList>
          <Button
            variant="text"
            onClick={handleCreate}
          >
            + Create new
          </Button>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            autoFocus
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

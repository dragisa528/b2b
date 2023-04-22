import { useContext, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Box } from '@mui/material'

import { B3CustomForm, B3Dialog } from '@/components'
import { GlobaledContext } from '@/shared/global'
import {
  createB2BShoppingList,
  createBcShoppingList,
} from '@/shared/service/b2b'

const list = [
  {
    name: 'name',
    label: 'Name',
    required: true,
    default: '',
    fieldType: 'text',
    xs: 12,
    variant: 'filled',
    size: 'small',
    maxLength: 200,
  },
  {
    name: 'description',
    label: 'Description',
    required: false,
    default: '',
    fieldType: 'multiline',
    xs: 12,
    variant: 'filled',
    size: 'small',
    rows: 4,
    maxLength: 200,
  },
]

interface CreateShoppingListProps {
  open: boolean
  onChange: () => void
  onClose: () => void
}

function CreateShoppingList({
  open,
  onChange,
  onClose,
}: CreateShoppingListProps) {
  const container = useRef<HTMLInputElement | null>(null)

  const [loading, setLoading] = useState<boolean>(false)

  const {
    state: { role, isB2BUser, currentChannelId },
  } = useContext(GlobaledContext)

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
  } = useForm({
    mode: 'onSubmit',
  })

  const handleClose = () => {
    onClose()
  }

  const handleConfirm = () => {
    handleSubmit(async (data) => {
      setLoading(true)
      const { description } = data
      if (description.indexOf('\n') > -1) {
        data.description = description.split('\n').join('\\n')
      }
      const createSL = isB2BUser ? createB2BShoppingList : createBcShoppingList

      const createShoppingData = data
      if (isB2BUser) {
        createShoppingData.status = +role === 2 ? 30 : 0
      } else {
        createShoppingData.channelId = currentChannelId
      }

      await createSL(createShoppingData)
      setLoading(false)
      onChange()
    })()
  }

  return (
    <Box
      sx={{
        ml: 3,
        cursor: 'pointer',
        width: '50%',
      }}
    >
      <Box ref={container} />

      <B3Dialog
        isOpen={open}
        fullWidth
        title="Create new"
        loading={loading}
        handleLeftClick={handleClose}
        handRightClick={handleConfirm}
      >
        <Box
          sx={{
            minHeight: 'auto',
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <B3CustomForm
            formFields={list}
            errors={errors}
            control={control}
            getValues={getValues}
            setValue={setValue}
          />
        </Box>
      </B3Dialog>
    </Box>
  )
}

export default CreateShoppingList

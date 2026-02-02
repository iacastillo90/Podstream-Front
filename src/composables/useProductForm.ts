import { ref, reactive, computed } from 'vue'
import { ProductService } from '@/services/productService'
import { storageService } from '@/services/storageService'
import type { Product } from '@/types/product'
import { useRouter } from 'vue-router'

export interface ProductFormState {
  name: string
  categoryId: number | null
  color: string
  price: number | null
  discount: number
  stock: number | null
  image: string
  description: string
  images: string[]
  brand: string
}

export interface FormErrors {
  name?: string
  categoryId?: string
  price?: string
  stock?: string
  description?: string
  discount?: string
  brand?: string
}

export function useProductForm() {
  const router = useRouter()
  const form = reactive<ProductFormState>({
    name: '',
    categoryId: null,
    color: '',
    price: null,
    discount: 0,
    stock: null,
    image: '',
    description: '',
    images: [''],
    brand: '',
  })

  // To track upload loading states per field?
  // For simplicity, we block global submit, but showing a spinner per image is better
  const uploadingIndexes = reactive<Record<string, boolean>>({})

  const errors = reactive<FormErrors>({})
  const isSubmitting = ref(false)

  const validate = (): boolean => {
    Object.keys(errors).forEach((key) => delete errors[key as keyof FormErrors])
    let isValid = true

    if (!form.name.trim()) {
      errors.name = 'El nombre es obligatorio'
      isValid = false
    }
    if (!form.categoryId) {
      errors.categoryId = 'Debes seleccionar una categoría'
      isValid = false
    }
    if (form.price === null || form.price < 0) {
      errors.price = 'Precio inválido'
      isValid = false
    }
    if (form.stock === null || form.stock < 0) {
      errors.stock = 'Stock inválido'
      isValid = false
    }
    if (!form.description.trim()) {
      errors.description = 'La descripción es obligatoria'
      isValid = false
    }
    if (form.discount < 0 || form.discount > 100) {
      errors.discount = 'Descuento inválido'
      isValid = false
    }

    return isValid
  }

  const addPhoto = () => {
    if (form.images.length < 5) form.images.push('')
  }

  const removePhoto = (index: number) => {
    form.images.splice(index, 1)
    if (form.images.length === 0) form.images.push('')
  }

  const handleFileUpload = async (event: Event, index: number | null = null) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    const key = index === null ? 'main' : `gallery-${index}`
    uploadingIndexes[key] = true

    try {
      const url = await storageService.uploadPhoto(file, 'products')

      if (index === null) {
        form.image = url
      } else {
        form.images[index] = url
      }
    } catch (error) {
      console.error('Upload failed:', error)
      const msg = (error as any)?.message || JSON.stringify(error)
      alert(`Error al subir la imagen: ${msg}`)
    } finally {
      uploadingIndexes[key] = false
    }
  }

  const submit = async () => {
    if (!validate()) return

    isSubmitting.value = true
    try {
      const productPayload: Omit<Product, 'id' | 'shortDescription'> & {
        shortDescription: string
      } = {
        name: form.name,
        categoryId: form.categoryId!,
        price: form.price!,
        stock: form.stock!,
        color: form.color,
        discount: form.discount,
        photos: form.images.filter((img) => img.trim() !== ''),
        image: form.image,
        description: form.description,
        shortDescription: form.description.substring(0, 100),
        brand: form.brand,
      }

      // Cast to satisfy potentially looser API types or strict overlap
      await ProductService.create(productPayload as any)

      alert(`Producto "${form.name}" creado con éxito.`)
      router.push('/admin/stock')
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Error al crear el producto')
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    form,
    errors,
    isSubmitting,
    uploadingIndexes,
    addPhoto,
    removePhoto,
    handleFileUpload,
    submit,
  }
}

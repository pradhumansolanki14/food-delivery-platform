/**
 * useToast — thin wrapper around react-hot-toast
 *
 * Provides consistent toast calls across the app with
 * pre-applied styles. Import this hook instead of calling
 * react-hot-toast directly so the UI stays consistent.
 *
 * Usage:
 *   const { success, error, info, loading, dismiss } = useToast()
 *   success('Item added to cart!')
 *   error('Something went wrong.')
 */
import toast from 'react-hot-toast'

const useToast = () => {
  const success = (message, options = {}) =>
    toast.success(message, { duration: 3000, ...options })

  const error = (message, options = {}) =>
    toast.error(message, { duration: 4000, ...options })

  const info = (message, options = {}) =>
    toast(message, {
      duration: 3000,
      icon: 'ℹ️',
      style: {
        background: '#eff6ff',
        color: '#1e40af',
        border: '1px solid #bfdbfe',
      },
      ...options,
    })

  const warning = (message, options = {}) =>
    toast(message, {
      duration: 4000,
      icon: '⚠️',
      style: {
        background: '#fffbeb',
        color: '#92400e',
        border: '1px solid #fde68a',
      },
      ...options,
    })

  const loading = (message, options = {}) =>
    toast.loading(message, { ...options })

  const promise = (promise, messages, options = {}) =>
    toast.promise(promise, messages, { ...options })

  const dismiss = (id) => toast.dismiss(id)

  return { success, error, info, warning, loading, promise, dismiss }
}

export default useToast

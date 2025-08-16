import { toast } from 'sonner'

interface ToastOptions {
  duration?: number
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
  dismissible?: boolean
}

export const useToast = () => {
  const success = (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'bottom-right',
      dismissible: options?.dismissible ?? true,
      style: {
        backgroundColor: '#6b8e23',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
      },
    })
  }

  const error = (message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: options?.duration || 5000,
      position: options?.position || 'bottom-right',
      dismissible: options?.dismissible ?? true,
      style: {
        backgroundColor: '#dc2626',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
      },
    })
  }

  const info = (message: string, options?: ToastOptions) => {
    toast.info(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'bottom-right',
      dismissible: options?.dismissible ?? true,
      style: {
        backgroundColor: '#4285f4',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
      },
    })
  }

  const warning = (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'bottom-right',
      dismissible: options?.dismissible ?? true,
      style: {
        backgroundColor: '#ff6b35',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
      },
    })
  }

  const promise = <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
      ...options
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    } & ToastOptions
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
      duration: options?.duration,
      position: options?.position || 'bottom-right',
      style: {
        backgroundColor: '#ffffff',
        color: '#000000',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
      },
    })
  }

  const dismiss = (toastId?: string | number) => {
    if (toastId) {
      toast.dismiss(toastId)
    } else {
      toast.dismiss()
    }
  }

  return {
    success,
    error,
    info,
    warning,
    promise,
    dismiss,
  }
}
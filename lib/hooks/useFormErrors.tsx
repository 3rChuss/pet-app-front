import { useCallback } from 'react'

import { type UseFormSetError, type FieldValues, type Path } from 'react-hook-form'

import { type ApiError } from '@/lib/hooks/useApiError'

interface UseFormErrorsOptions<T extends FieldValues> {
  setError: UseFormSetError<T>
}

/**
 * Hook especializado para manejar errores de validación en formularios
 * Trabaja en conjunto con react-hook-form para mostrar errores inline
 */
export function useFormErrors<T extends FieldValues>({ setError }: UseFormErrorsOptions<T>) {
  /**
   * Mapea errores de validación de la API a campos específicos del formulario
   */
  const mapApiErrorsToForm = useCallback(
    (error: ApiError) => {
      if (!error.validationErrors) {
        return false
      }

      // Si es un string, es un error general
      if (typeof error.validationErrors === 'string') {
        return false
      }

      // Mapear errores a campos específicos
      let hasFieldErrors = false
      Object.entries(error.validationErrors).forEach(([field, errors]) => {
        const errorMessage = Array.isArray(errors) ? errors[0] : errors

        // Convertir nombres de campo de la API a nombres de campo del formulario
        const formFieldName = mapApiFieldToFormField(field)

        if (formFieldName) {
          setError(formFieldName as Path<T>, {
            type: 'manual',
            message: errorMessage,
          })
          hasFieldErrors = true
        }
      })

      return hasFieldErrors
    },
    [setError]
  )

  return {
    mapApiErrorsToForm,
  }
}

/**
 * Mapea nombres de campo de la API a nombres de campo del formulario
 * Personaliza según tu API y estructura de formularios
 */
function mapApiFieldToFormField(apiField: string): string | null {
  const fieldMapping: Record<string, string> = {
    // Mapeo común de API a formulario
    email: 'email',
    password: 'password',
    password_confirmation: 'passwordConfirmation',
    confirm_password: 'passwordConfirmation',
    first_name: 'firstName',
    last_name: 'lastName',
    phone_number: 'phoneNumber',
    date_of_birth: 'dateOfBirth',
    // Agrega más mapeos según tus necesidades
  }

  return fieldMapping[apiField] || apiField
}

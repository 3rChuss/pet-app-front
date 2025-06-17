import { useCallback } from 'react'

import { type UseFormSetError, type FieldValues, type Path } from 'react-hook-form'

import { type ApiError } from '@/lib/hooks/useApiError'

interface UseFormErrorsOptions<T extends FieldValues> {
  setError: UseFormSetError<T>
}

/**
 * Hook especializado para manejar errores de validación en formularios
 * Trabaja en conjunto con react-hook-form para mostrar errores inline
 * Optimizado para respuestas de Laravel y otros backends comunes
 */
export function useFormErrors<T extends FieldValues>({ setError }: UseFormErrorsOptions<T>) {
  /**
   * Mapea errores de validación de la API a campos específicos del formulario
   * Maneja la estructura de respuesta de Laravel: { errors: { campo: ["mensaje"] } }
   */
  const mapApiErrorsToForm = useCallback(
    (error: ApiError) => {
      if (!error.validationErrors) {
        console.log('🔍 No validation errors found in:', error)
        return false
      }

      // Si es un string, es un error general (no mapeable a campos específicos)
      if (typeof error.validationErrors === 'string') {
        console.log('🔍 String validation error (no field mapping):', error.validationErrors)
        return false
      }

      // Verificar que sea un objeto con errores
      if (typeof error.validationErrors !== 'object' || error.validationErrors === null) {
        console.log('🔍 Invalid validation errors format:', error.validationErrors)
        return false
      }

      // Mapear errores a campos específicos
      let hasFieldErrors = false
      let totalErrors = 0
      let mappedErrors = 0

      Object.entries(error.validationErrors).forEach(([apiField, errors]) => {
        totalErrors++

        // Obtener el primer mensaje de error (Laravel envía arrays)
        const errorMessage = Array.isArray(errors) ? errors[0] : errors

        // Convertir nombres de campo de la API a nombres de campo del formulario
        const formFieldName = mapApiFieldToFormField(apiField)

        if (__DEV__) {
          console.log(
            `🔍 Mapping field: ${apiField} -> ${formFieldName} | Message: ${errorMessage}`
          )
        }

        if (formFieldName) {
          try {
            setError(formFieldName as Path<T>, {
              type: 'server',
              message: errorMessage,
            })
            hasFieldErrors = true
            mappedErrors++

            if (__DEV__) {
              console.log(`✅ Successfully mapped: ${apiField} -> ${formFieldName}`)
            }
          } catch (setErrorError) {
            console.warn(`❌ Failed to set error for field ${formFieldName}:`, setErrorError)
          }
        } else {
          if (__DEV__) {
            console.log(`⚠️ No mapping found for API field: ${apiField}`)
          }
        }
      })

      if (__DEV__) {
        console.log(`🔍 Form error mapping summary: ${mappedErrors}/${totalErrors} errors mapped`)
      }

      return hasFieldErrors
    },
    [setError]
  )

  /**
   * Limpia todos los errores del formulario de origen server
   */
  const clearServerErrors = useCallback(() => {
    // Esta función sería útil para limpiar errores antes de un nuevo submit
    // Desafortunadamente react-hook-form no tiene una forma directa de limpiar solo errores 'server'
    // Pero podríamos implementar esto si es necesario
  }, [])

  return {
    mapApiErrorsToForm,
    clearServerErrors,
  }
}

/**
 * Mapea nombres de campo de la API (Laravel snake_case) a nombres de campo del formulario (camelCase)
 * Personaliza según tu API y estructura de formularios
 */
function mapApiFieldToFormField(apiField: string): string | null {
  const fieldMapping: Record<string, string> = {
    // Campos de autenticación
    email: 'email',
    password: 'password',
    password_confirmation: 'passwordConfirmation',
    confirm_password: 'passwordConfirmation',

    // Campos de perfil de usuario
    first_name: 'firstName',
    last_name: 'lastName',
    user_name: 'userName',
    username: 'userName',
    phone_number: 'phoneNumber',
    date_of_birth: 'dateOfBirth',

    // Campos específicos de la app (ajustar según necesidades)
    accepted_privacy_policy: 'acceptedPrivacyPolicy',
    accepted_terms: 'acceptedTerms',
    accept_privacy_policy: 'acceptedPrivacyPolicy',
    accept_terms: 'acceptedTerms',

    // Campos de mascota (si aplica)
    pet_name: 'petName',
    pet_type: 'petType',
    pet_breed: 'petBreed',
    pet_age: 'petAge',

    // Campos de dirección
    street_address: 'streetAddress',
    postal_code: 'postalCode',
    city: 'city',
    state: 'state',
    country: 'country',

    // Campos de publicación/post
    title: 'title',
    content: 'content',
    description: 'description',
    category: 'category',
    tags: 'tags',

    // Campos de contacto
    message: 'message',
    subject: 'subject',

    // Agregar más mapeos según las necesidades específicas de tu aplicación
  }

  // Primero intentar mapeo directo
  if (fieldMapping[apiField]) {
    return fieldMapping[apiField]
  }

  // Si no hay mapeo directo, intentar convertir snake_case a camelCase
  const camelCaseField = apiField.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())

  // Verificar si el campo camelCase podría existir (esto es una heurística)
  // En una implementación más robusta, podrías mantener una lista de campos válidos
  if (camelCaseField !== apiField) {
    if (__DEV__) {
      console.log(`🔄 Auto-converted ${apiField} -> ${camelCaseField}`)
    }
    return camelCaseField
  }

  // Si todo falla, retornar el campo original por si acaso funciona
  return apiField
}

/**
 * Utilidad para agregar mapeos de campo dinámicamente
 * Útil para casos específicos o testing
 */
export function addFieldMapping(apiField: string, formField: string) {
  // Esta función podría ser útil para casos especiales
  // Pero requeriría una implementación más sofisticada con estado global
  console.warn(
    'addFieldMapping not implemented yet. Add mapping to mapApiFieldToFormField function.'
  )
}
export function removeFieldMapping(apiField: string) {
  // Similar a addFieldMapping, pero para eliminar mapeos
  console.warn(
    'removeFieldMapping not implemented yet. Remove mapping from mapApiFieldToFormField function.'
  )
}

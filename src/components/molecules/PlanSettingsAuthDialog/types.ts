/**
 * Types for Plan Settings Authentication Dialog
 * Defines interfaces for secure access to critical business settings
 */

export interface PlanSettingsAuthDialogProps {
  /** Whether the authentication dialog is open */
  isOpen: boolean
  /** Callback when dialog is closed/cancelled */
  onClose: () => void
  /** Callback when authentication is successful */
  onSuccess: () => void
}

export interface AuthenticationState {
  /** Current PIN entry state */
  pin: string[]
  /** Error message if authentication fails */
  error: string
  /** Whether PIN verification is in progress */
  isVerifying: boolean
}

export interface PinInputProps {
  /** Current digit value */
  value: string
  /** Input index (0-3) */
  index: number
  /** Whether input is disabled during verification */
  disabled: boolean
  /** Whether there's an authentication error */
  hasError: boolean
  /** Callback when digit value changes */
  onChange: (index: number, value: string) => void
  /** Callback for key events (backspace, enter) */
  onKeyDown: (index: number, event: React.KeyboardEvent) => void
}
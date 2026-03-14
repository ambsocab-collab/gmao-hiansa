'use client'

/**
 * Capability Checkbox Group Component
 * Story 1.2: Sistema PBAC con 15 Capacidades
 *
 * Displays 15 PBAC capabilities as checkboxes with Spanish labels.
 * Used in user creation/editing forms to assign capabilities to users.
 *
 * Features:
 * - Shows all 15 capabilities with Spanish labels
 * - data-testid attributes for E2E testing
 * - Organized in a 2-column grid for better UX
 * - Shows capability description as tooltip
 *
 * Usage:
 * ```tsx
 * <CapabilityCheckboxGroup
 *   selectedCapabilities={['can_create_failure_report']}
 *   onChange={(caps) => setCapabilities(caps)}
 *   disabled={false}
 * />
 * ```
 */

import { CAPABILITIES } from '@/lib/capabilities'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CapabilityCheckboxGroupProps {
  /**
   * Array of selected capability names
   */
  selectedCapabilities: string[]

  /**
   * Callback when capabilities change
   * @param capabilities - New array of selected capability names
   */
  onChange: (capabilities: string[]) => void

  /**
   * Whether all checkboxes are disabled
   * @default false
   */
  disabled?: boolean
}

/**
 * Capability Checkbox Group Component
 */
export function CapabilityCheckboxGroup({
  selectedCapabilities,
  onChange,
  disabled = false
}: CapabilityCheckboxGroupProps) {

  /**
   * Toggle capability selection
   * @param capabilityName - Capability name to toggle
   * @param checked - Whether the capability is now checked
   */
  const handleCapabilityToggle = (capabilityName: string, checked: boolean) => {
    if (checked) {
      // Add capability if not already present
      if (!selectedCapabilities.includes(capabilityName)) {
        onChange([...selectedCapabilities, capabilityName])
      }
    } else {
      // Remove capability
      onChange(selectedCapabilities.filter((cap) => cap !== capabilityName))
    }
  }

  return (
    <Card data-testid="capabilities-checkbox-group">
      <CardHeader>
        <CardTitle>Capacidades del Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        {/* AC1: Checkbox group with data-testid="capabilities-checkbox-group" */}
        <div
          data-testid="capabilities-checkbox-group"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {CAPABILITIES.map((capability) => {
            const isChecked = selectedCapabilities.includes(capability.name)

            return (
              <div
                key={capability.name}
                className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* AC1: Each checkbox has data-testid="capability-{name}" */}
                <Checkbox
                  id={capability.name}
                  data-testid={`capability-${capability.name}`}
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handleCapabilityToggle(capability.name, checked === true)
                  }
                  disabled={disabled}
                  className="mt-1"
                />

                <div className="flex-1 space-y-1">
                  <Label
                    htmlFor={capability.name}
                    className="font-medium cursor-pointer"
                  >
                    {capability.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {capability.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Show count of selected capabilities */}
        <div className="mt-4 text-sm text-muted-foreground">
          {selectedCapabilities.length} de {CAPABILITIES.length} capacidades seleccionadas
        </div>
      </CardContent>
    </Card>
  )
}

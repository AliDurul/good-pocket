import type { ReactNode } from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { SelectInput } from '@/components/ui/select';
import { DateTimePickerInput } from '@/components/ui/date-time-picker';
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
} from '@/components/ui/form-control';

interface AuthFieldProps {
  label: string;
  /** Renders the design's muted "· optional" suffix after the label. */
  optional?: boolean;
  error?: string;
  /** Helper line under the field — the 🎁 birthday note, password strength caption, etc. */
  helper?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Label + error chrome shared by every auth form field (design frames 1f–1i).
 * The field itself is passed as `children` so text inputs, selects and date
 * pickers can all sit in the same shell.
 */
export function AuthField({
  label,
  optional = false,
  error,
  helper,
  children,
  className,
}: AuthFieldProps) {
  return (
    <FormControl isInvalid={!!error} className={className}>
      <FormControlLabel className="mb-1.5">
        <Text className="font-poppins-medium text-[11px] text-muted-foreground">
          {label}
          {optional ? (
            <Text className="font-poppins text-[11px] text-muted-foreground/70">
              {' · optional'}
            </Text>
          ) : null}
        </Text>
      </FormControlLabel>

      {children}

      {helper && !error ? <Box className="mt-1.5">{helper}</Box> : null}

      <FormControlError>
        <FormControlErrorText className="font-poppins text-[11px]">
          {error}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
}

/** Ivory-on-white field shell: white fill, hairline border, gold border on focus. */
const SHELL =
  'w-full rounded-[14px] border-[1.5px] border-border bg-card px-[14px] ' +
  'data-[focus=true]:border-primary data-[focus=true]:web:ring-0 ' +
  'data-[invalid=true]:border-destructive';

// Height goes through className, not an inline `style`, so it reliably overrides the
// `h-13` in gluestack's own base class rather than racing it.
const HEIGHTS = { 48: 'h-12', 50: 'h-[50px]' } as const;

interface AuthInputProps extends React.ComponentProps<typeof Input> {
  /** Login uses 50px fields, register's denser two-step form uses 48px. */
  height?: 48 | 50;
}

/** The gluestack `Input` restyled to the design. Wrap `InputField` in it as usual. */
export function AuthInput({ height = 50, className, ...props }: AuthInputProps) {
  return <Input {...props} className={`${SHELL} ${HEIGHTS[height]} ${className ?? ''}`} />;
}

interface AuthFieldBoxProps {
  height?: 48 | 50;
  isInvalid?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Same shell as `AuthInput` but a plain Box, for controls that aren't a TextInput
 * (Select triggers, the date picker trigger, the referral-style read-only rows).
 */
export function AuthFieldBox({
  height = 48,
  isInvalid = false,
  children,
  className,
}: AuthFieldBoxProps) {
  return (
    <Box
      className={`w-full flex-row items-center justify-between rounded-[14px] border-[1.5px] bg-card px-[14px] ${HEIGHTS[height]} ${
        isInvalid ? 'border-destructive' : 'border-border'
      } ${className ?? ''}`}
    >
      {children}
    </Box>
  );
}

/**
 * Shared text style for values typed into an auth field. Carries an explicit
 * `leading-*` so the Select and DateTimePicker inputs in register step 2 share a
 * metric with the plain text inputs in step 1.
 */
export const AUTH_INPUT_TEXT =
  'font-poppins-medium text-[14px] leading-[18px] text-foreground';

/**
 * `InputField` with the vertical centering actually fixed.
 *
 * gluestack's own `inputFieldStyle` is `... py-1 h-full ... ios:leading-[0px]`.
 * `h-full` stretches the TextInput to the container's full height, which makes the
 * row's `items-center` a no-op for it — so vertical position falls to the TextInput's
 * internal text layout, where `py-1`, Android's `includeFontPadding`, and iOS's
 * `lineHeight: 0` decide it. Sibling `Text` nodes in the same row (the `+260` prefix,
 * the Show/Hide toggle) *are* flex-centred, which is why the baselines visibly diverge.
 *
 * `py-0` goes through `className` (tailwind-merge cleanly beats `py-1`), but the
 * remaining three go through `style`: an unprefixed `leading-*` will not reliably
 * out-merge the variant-prefixed `ios:leading-[0px]`, and `includeFontPadding` has no
 * Tailwind equivalent at all. gluestack's `InputField` forwards `style` untouched.
 */
export function AuthInputField({
  className,
  style,
  ...props
}: React.ComponentProps<typeof InputField>) {
  return (
    <InputField
      {...props}
      className={`${AUTH_INPUT_TEXT} py-0 ${className ?? ''}`}
      style={[
        { lineHeight: 18, includeFontPadding: false, textAlignVertical: 'center' },
        style,
      ]}
    />
  );
}

/** `SelectInput` with the same vertical-centering fix as `AuthInputField` — same root cause. */
export function AuthSelectInput({
  className,
  style,
  ...props
}: React.ComponentProps<typeof SelectInput>) {
  return (
    <SelectInput
      {...props}
      className={`${AUTH_INPUT_TEXT} py-0 ${className ?? ''}`}
      style={[
        { lineHeight: 18, includeFontPadding: false, textAlignVertical: 'center' },
        style,
      ]}
    />
  );
}

/**
 * `DateTimePickerInput` with the same vertical-centering fix as `AuthInputField`.
 * `pointerEvents: 'none'` is repeated here because `DateTimePickerInput` sets its own
 * `style={{ pointerEvents: 'none' }}` *before* spreading incoming props, so any `style`
 * we pass in fully replaces (not merges with) that default.
 */
export function AuthDateTimePickerInput({
  className,
  style,
  ...props
}: React.ComponentProps<typeof DateTimePickerInput>) {
  return (
    <DateTimePickerInput
      {...props}
      className={`${AUTH_INPUT_TEXT} py-0 ${className ?? ''}`}
      style={[
        {
          lineHeight: 18,
          includeFontPadding: false,
          textAlignVertical: 'center',
          pointerEvents: 'none',
        },
        style,
      ]}
    />
  );
}

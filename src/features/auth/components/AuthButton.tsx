import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';

// `variant` is re-declared, so gluestack's own (which carries different values and
// its own styling) is dropped rather than merged.
interface AuthButtonProps extends Omit<React.ComponentProps<typeof Button>, 'variant'> {
  label: string;
  /** Swaps the label for a spinner + `loadingLabel`. */
  isLoading?: boolean;
  loadingLabel?: string;
  variant?: 'solid' | 'outline';
}

/**
 * The gold pill CTA from frames 1e–1i. Label sits in `text-primary-foreground`
 * (dark brown on gold) — `text-secondary-foreground` here would be ivory on gold
 * at 2.53:1, the contrast failure the old register screen shipped.
 */
export function AuthButton({
  label,
  isLoading = false,
  loadingLabel = 'Please wait...',
  variant = 'solid',
  className,
  ...props
}: AuthButtonProps) {
  const isSolid = variant === 'solid';

  return (
    <Button
      {...props}
      className={`h-[52px] w-full rounded-[26px] ${
        isSolid ? 'bg-primary' : 'border-[1.5px] border-primary bg-transparent'
      } ${className ?? ''}`}
    >
      {isLoading ? (
        <>
          <ButtonSpinner className={isSolid ? 'text-primary-foreground' : 'text-secondary'} />
          <ButtonText
            className={`font-poppins-semibold text-[14.5px] ${
              isSolid ? 'text-primary-foreground' : 'text-secondary'
            }`}
          >
            {loadingLabel}
          </ButtonText>
        </>
      ) : (
        <ButtonText
          className={`font-poppins-semibold text-[14.5px] ${
            isSolid ? 'text-primary-foreground' : 'text-secondary'
          }`}
        >
          {label}
        </ButtonText>
      )}
    </Button>
  );
}

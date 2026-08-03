import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onPressAction }: SectionHeaderProps) {
  return (
    <HStack className="items-baseline justify-between px-4 pb-2.5 pt-[18px]">
      <Text className="font-playfair text-[16px] text-foreground">{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onPressAction} accessibilityRole="button">
          <Text className="font-poppins-medium text-[11px] text-primary-strong">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </HStack>
  );
}

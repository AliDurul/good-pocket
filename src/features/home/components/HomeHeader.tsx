import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Bell } from 'lucide-react-native';

interface HomeHeaderProps {
  greeting: string;
  name: string;
  /** Single uppercase character shown in the avatar. */
  initial: string;
  hasUnread: boolean;
  onPressBell?: () => void;
  onPressAvatar?: () => void;
}

export function HomeHeader({
  greeting,
  name,
  initial,
  hasUnread,
  onPressBell,
  onPressAvatar,
}: HomeHeaderProps) {
  return (
    <HStack className="items-center justify-between px-4 pb-3 pt-2">
      <VStack>
        <Text className="font-body text-[11px] text-muted-foreground">{greeting}</Text>
        <Text className="font-body-semibold text-[16px] text-foreground">{name} 👋</Text>
      </VStack>

      <HStack className="items-center gap-3">
        <Pressable
          onPress={onPressBell}
          accessibilityRole="button"
          accessibilityLabel={
            hasUnread ? 'Notifications, unread' : 'Notifications'
          }
          className="h-9 w-9 items-center justify-center rounded-full border border-border bg-card"
        >
          <Bell size={16} color="rgb(74 28 10)" strokeWidth={2} />
          {hasUnread ? (
            <Box className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-[1.5px] border-card bg-primary" />
          ) : null}
        </Pressable>

        <Pressable
          onPress={onPressAvatar}
          accessibilityRole="button"
          accessibilityLabel="Account"
          className="h-[38px] w-[38px] items-center justify-center rounded-full bg-secondary"
        >
          <Text className="font-body-semibold text-[16px] text-primary">{initial}</Text>
        </Pressable>
      </HStack>
    </HStack>
  );
}

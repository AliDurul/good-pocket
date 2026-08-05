import { useRef, useState } from 'react'
import { Keyboard, Pressable, TextInput } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Lock } from 'lucide-react-native'
import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { Icon } from '@/components/ui/icon'
import { Spinner } from '@/components/ui/spinner'
import { SafeAreaView } from '@/components/ui/safe-area-view'
import { useAppToast } from '@/hooks/useAppToast'
import { formatResendDelay, maskEmail, useResendTimer } from '@/features/auth'

const CODE_LENGTH = 6
const RESEND_SECONDS = 60

export default function ForgotPassword() {
    const router = useRouter()
    const toast = useAppToast()
    const { email } = useLocalSearchParams<{ email?: string }>()

    const [code, setCode] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const inputRef = useRef<TextInput>(null)
    const { seconds, canResend, restart } = useResendTimer(RESEND_SECONDS)

    // Better Auth on this project has no OTP / password-reset provider configured, so
    // there is no endpoint to call yet. The screen is fully wired — swap these two
    // handlers for `authClient.emailOtp.*` once the server grows them.
    const verifyCode = (value: string) => {
        Keyboard.dismiss()
        toast.info(`Verification is not wired up yet (code ${value}).`, {
            title: 'Coming soon',
        })
    }

    const handleResend = () => {
        if (!canResend) return
        restart()
        setCode('')
        toast.info('Resending is not wired up yet.', { title: 'Coming soon' })
    }

    const handleChange = (raw: string) => {
        const digits = raw.replace(/\D/g, '').slice(0, CODE_LENGTH)
        setCode(digits)
        if (digits.length === CODE_LENGTH) verifyCode(digits)
    }

    const boxes = Array.from({ length: CODE_LENGTH }, (_, i) => i)

    return (
        <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background">
            <Box className="flex-1 bg-background px-6 pt-4">
                <Pressable
                    onPress={() => router.back()}
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                >
                    <Box className="h-[30px] w-[30px] items-center justify-center rounded-full border border-border bg-card">
                        <Text className="font-poppins-bold text-[16px] leading-[18px] text-secondary">‹</Text>
                    </Box>
                </Pressable>

                <Box className="mt-[22px] h-[58px] w-[58px] items-center justify-center rounded-[16px] border border-border bg-card">
                    <Icon as={Lock} className="h-6 w-6 text-primary" />
                </Box>

                <Text className="mt-[18px] font-playfair text-[24px] leading-[30px] text-foreground">
                    Enter the code
                </Text>
                <Text className="mt-[6px] font-poppins text-[13px] leading-5 text-muted-foreground">
                    We sent a {CODE_LENGTH}-digit code to{'\n'}
                    <Text className="font-poppins-semibold text-[13px] text-foreground">
                        {maskEmail(email ?? '')}
                    </Text>
                </Text>

                {/* One offscreen input drives all six boxes — keeps paste and SMS autofill
                    working, which per-box inputs break. */}
                <Pressable onPress={() => inputRef.current?.focus()} accessibilityRole="none">
                    <HStack className="mt-6 gap-[9px]">
                        {boxes.map((index) => {
                            const char = code[index]
                            const isActive = isFocused && index === Math.min(code.length, CODE_LENGTH - 1)

                            return (
                                <Box
                                    key={index}
                                    className={`h-[54px] flex-1 items-center justify-center rounded-[12px] bg-card ${isActive ? 'border-2 border-primary' : 'border-[1.5px] border-border'
                                        }`}
                                >
                                    <Text className="font-poppins-semibold text-[22px] text-foreground">
                                        {char ?? ''}
                                    </Text>
                                </Box>
                            )
                        })}
                    </HStack>
                </Pressable>

                <TextInput
                    ref={inputRef}
                    value={code}
                    onChangeText={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    keyboardType="number-pad"
                    maxLength={CODE_LENGTH}
                    textContentType="oneTimeCode"
                    autoComplete="sms-otp"
                    autoFocus
                    caretHidden
                    accessibilityLabel={`${CODE_LENGTH} digit verification code`}
                    style={{ position: 'absolute', opacity: 0, height: 1, width: 1 }}
                />

                <HStack className="mt-[22px] items-center gap-1">
                    <Text className="font-poppins text-[12.5px] text-muted-foreground">
                        Didn&apos;t get it?
                    </Text>
                    <Pressable onPress={handleResend} disabled={!canResend} hitSlop={8} accessibilityRole="button">
                        <Text
                            className={`font-poppins-medium text-[12.5px] ${canResend ? 'text-primary' : 'text-muted-foreground'
                                }`}
                        >
                            Resend code
                        </Text>
                    </Pressable>
                    {!canResend && (
                        <Text className="font-poppins text-[12.5px] text-muted-foreground/70">
                            {formatResendDelay(seconds)}
                        </Text>
                    )}
                </HStack>

                <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button">
                    <Text className="mt-[14px] font-poppins-medium text-[12.5px] text-primary">
                        Change email address
                    </Text>
                </Pressable>

                <HStack className="mt-[26px] items-center gap-[10px] rounded-[14px] border border-border bg-card px-[14px] py-3">
                    {/* Always spinning — the screen really is waiting on the code the whole
                        time it is open, which is what the hint says. */}
                    <Spinner className="text-primary" size="small" />
                    <Text className="flex-1 font-poppins text-[12px] text-muted-foreground">
                        Code submits automatically once complete
                    </Text>
                </HStack>
            </Box>
        </SafeAreaView>
    )
}

import { useState, type Dispatch, type SetStateAction } from 'react'
import { Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import {
    Controller,
    type Control,
    type FieldErrors,
    type UseFormTrigger,
    type UseFormWatch,
} from 'react-hook-form'
import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import type { SignUpForm } from '@/zod/auth'
import { AuthButton, AuthField, AuthInput, AuthInputField } from '@/features/auth'

interface IStep1Props {
    errors: FieldErrors<SignUpForm>
    control: Control<SignUpForm>
    watch: UseFormWatch<SignUpForm>
    trigger: UseFormTrigger<SignUpForm>
    setStep: Dispatch<SetStateAction<1 | 2>>
}

const STRENGTH_SEGMENTS = 3

interface Strength {
    label: string
    /** How many of the three segments to fill. */
    filled: number
    fill: string
    text: string
}

function getPasswordStrength(password: string): Strength {
    if (!password) return { label: '', filled: 0, fill: '', text: '' }
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (score <= 1) return { label: 'Weak password', filled: 1, fill: 'bg-destructive', text: 'text-destructive' }
    if (score <= 2) return { label: 'Medium password', filled: 2, fill: 'bg-primary', text: 'text-primary-strong' }
    return { label: 'Strong password', filled: 3, fill: 'bg-success', text: 'text-success' }
}

export default function Step1({ errors, control, watch, trigger, setStep }: IStep1Props) {

    const [showPass, setShowPass] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const router = useRouter()

    const passwordValue = watch('password')
    const strength = getPasswordStrength(passwordValue)

    const handleNext = async () => {
        const valid = await trigger(['name', 'phone', 'password', 'confirmPassword', 'email'])
        if (valid) setStep(2)
    }

    const revealLabel = (shown: boolean) => (shown ? 'Hide' : 'Show')

    return (
        <Box className="w-full gap-[13px]">
            <AuthField label="Full name" error={errors.name?.message}>
                <Controller
                    name="name"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AuthInput height={48} isInvalid={!!errors.name}>
                            <AuthInputField
                                placeholder="Sarah Mwansa"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        </AuthInput>
                    )}
                />
            </AuthField>

            <AuthField label="Phone number" error={errors.phone?.message}>
                <Controller
                    name="phone"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AuthInput height={48} isInvalid={!!errors.phone}>
                            {/* Same size + leading as AUTH_INPUT_TEXT so the prefix and the
                                typed digits sit on one baseline. */}
                            <Text className="font-poppins-medium text-[14px] leading-[18px] text-muted-foreground">+260</Text>
                            <AuthInputField
                                placeholder="97 123 4567"
                                keyboardType="phone-pad"
                                maxLength={9}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        </AuthInput>
                    )}
                />
            </AuthField>

            <AuthField label="Email" error={errors.email?.message}>
                <Controller
                    name="email"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AuthInput height={48} isInvalid={!!errors.email}>
                            <AuthInputField
                                placeholder="you@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        </AuthInput>
                    )}
                />
            </AuthField>

            <AuthField
                label="Password"
                error={errors.password?.message}
                helper={
                    passwordValue ? (
                        <Box>
                            <HStack className="gap-[5px]">
                                {Array.from({ length: STRENGTH_SEGMENTS }, (_, i) => (
                                    <Box
                                        key={i}
                                        className={`h-1 flex-1 rounded-[2px] ${i < strength.filled ? strength.fill : 'bg-border'}`}
                                    />
                                ))}
                            </HStack>
                            <Text className={`mt-[5px] font-poppins-medium text-[10px] ${strength.text}`}>
                                {strength.label}
                            </Text>
                        </Box>
                    ) : null
                }
            >
                <Controller
                    name="password"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AuthInput height={48} isInvalid={!!errors.password}>
                            <AuthInputField
                                placeholder="••••••••"
                                secureTextEntry={!showPass}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            <Pressable
                                onPress={() => setShowPass(!showPass)}
                                hitSlop={12}
                                accessibilityRole="button"
                                accessibilityLabel={`${revealLabel(showPass)} password`}
                            >
                                <Text className="font-poppins-semibold text-[11px] text-primary">
                                    {revealLabel(showPass)}
                                </Text>
                            </Pressable>
                        </AuthInput>
                    )}
                />
            </AuthField>

            <AuthField label="Confirm password" error={errors.confirmPassword?.message}>
                <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AuthInput height={48} isInvalid={!!errors.confirmPassword}>
                            <AuthInputField
                                placeholder="••••••••"
                                secureTextEntry={!showConfirm}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            <Pressable
                                onPress={() => setShowConfirm(!showConfirm)}
                                hitSlop={12}
                                accessibilityRole="button"
                                accessibilityLabel={`${revealLabel(showConfirm)} confirmed password`}
                            >
                                <Text className="font-poppins-semibold text-[11px] text-primary">
                                    {revealLabel(showConfirm)}
                                </Text>
                            </Pressable>
                        </AuthInput>
                    )}
                />
            </AuthField>

            <Box className="mt-2">
                <AuthButton label="Next" onPress={handleNext} />
            </Box>

            <Box className="flex-row items-center justify-center gap-1 pt-1">
                <Text className="font-poppins text-[12.5px] text-muted-foreground">
                    Already have an account?
                </Text>
                <Pressable onPress={() => router.push('/login')} hitSlop={8} accessibilityRole="button">
                    <Text className="font-poppins-semibold text-[12.5px] text-primary">Sign in</Text>
                </Pressable>
            </Box>
        </Box>
    )
}

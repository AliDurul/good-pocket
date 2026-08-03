import {
    FormControl,
    FormControlError,
    FormControlErrorText,
    FormControlHelper,
    FormControlHelperText,
    FormControlLabel,
    FormControlLabelText,
} from '@/components/ui/form-control'
import {
    ArrowRight,
    CalendarDays,
    ChevronDown,
    Crosshair,
    Eye,
    EyeClosed,
    Globe,
    Lock,
    Mail,
    Map,
    MapPin,
    User,
} from 'lucide-react-native'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { Controller, } from 'react-hook-form'
import { Pressable, View } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'

interface IStep1Props {
    errors: any;
    control: any;
    watch: any;
    trigger: any;
    setStep: any;
}

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
    if (!password) return { label: '', color: '', width: 'w-0' }
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (score <= 1) return { label: 'Weak', color: 'bg-destructive', width: 'w-1/3' }
    if (score <= 2) return { label: 'Medium', color: 'bg-yellow-500', width: 'w-2/3' }
    return { label: 'Strong', color: 'bg-green-500', width: 'w-full' }
}

export default function Step1({ errors, control, watch, trigger, setStep }: IStep1Props) {

    const [showPass, setShowPass] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const router = useRouter();

    const passwordValue = watch('password')
    const strength = getPasswordStrength(passwordValue)

    const handleNext = async () => {
        const valid = await trigger(['name', 'phone', 'password', 'confirmPassword', 'email'])
        if (valid) setStep(2)
    }


    return (
        <Box className="w-full gap-5">
            {/* Full Name */}
            <FormControl isInvalid={!!errors.name}>
                <FormControlLabel>
                    <FormControlLabelText className={errors.name ? 'text-destructive' : 'text-secondary-foreground'}>
                        Full Name
                    </FormControlLabelText>
                </FormControlLabel>
                <Controller
                    name="name"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input className={`bg-secondary-foreground ${errors.name ? 'border-2 border-destructive' : ''}`}>
                            <InputSlot className="pl-3">
                                <InputIcon as={User} className="text-muted-foreground" />
                            </InputSlot>
                            <InputField
                                placeholder="Your name.."
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        </Input>
                    )}
                />
                <FormControlError>
                    <FormControlErrorText>{errors.name?.message}</FormControlErrorText>
                </FormControlError>
            </FormControl>

            {/* Phone */}
            <FormControl isInvalid={!!errors.phone}>
                <FormControlLabel>
                    <FormControlLabelText className={errors.phone ? 'text-destructive' : 'text-secondary-foreground'}>
                        Phone Number
                    </FormControlLabelText>
                </FormControlLabel>
                <Controller
                    name="phone"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input className={`bg-secondary-foreground ${errors.phone ? 'border-2 border-destructive' : ''}`}>
                            <InputSlot className="pl-3">
                                <Text size="sm" className="text-muted-foreground font-medium">+260</Text>
                            </InputSlot>
                            <InputField
                                placeholder="97 123 4567"
                                keyboardType="phone-pad"
                                maxLength={9}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        </Input>
                    )}
                />
                <FormControlError>
                    <FormControlErrorText>{errors.phone?.message}</FormControlErrorText>
                </FormControlError>
            </FormControl>

            {/* Email */}
            <FormControl isInvalid={!!errors.email}>
                <FormControlLabel>
                    <FormControlLabelText className={errors.email ? 'text-destructive' : 'text-secondary-foreground'}>
                        Email Address
                    </FormControlLabelText>
                </FormControlLabel>
                <Controller
                    name="email"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input className={`bg-secondary-foreground ${errors.email ? 'border-2 border-destructive' : ''}`}>
                            <InputSlot className="pl-3">
                                <InputIcon as={Mail} className="text-muted-foreground" />
                            </InputSlot>
                            <InputField
                                placeholder="Your email.."
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        </Input>
                    )}
                />
                <FormControlError>
                    <FormControlErrorText>{errors.email?.message}</FormControlErrorText>
                </FormControlError>
            </FormControl>

            {/* Password */}
            <FormControl isInvalid={!!errors.password}>
                <FormControlLabel>
                    <FormControlLabelText className={errors.password ? 'text-destructive' : 'text-secondary-foreground'}>
                        Password
                    </FormControlLabelText>
                </FormControlLabel>
                <Controller
                    name="password"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input className={`bg-secondary-foreground ${errors.password ? 'border-2 border-destructive' : ''}`}>
                            <InputSlot className="pl-3">
                                <InputIcon as={Lock} className="text-muted-foreground" />
                            </InputSlot>
                            <InputField
                                placeholder="••••••••"
                                secureTextEntry={!showPass}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            <Button variant="ghost" onPress={() => setShowPass(!showPass)}>
                                <ButtonIcon as={showPass ? Eye : EyeClosed} className="text-muted-foreground" />
                            </Button>
                        </Input>
                    )}
                />
                {passwordValue ? (
                    <Box className="mt-1 gap-1">
                        <Box className="w-full h-1 bg-secondary-foreground/20 rounded-full overflow-hidden">
                            <View className={`h-full rounded-full ${strength.color} ${strength.width}`} />
                        </Box>
                        <Text size="xs" className="text-secondary-foreground/60 text-right">{strength.label}</Text>
                    </Box>
                ) : null}
                <FormControlError>
                    <FormControlErrorText>{errors.password?.message}</FormControlErrorText>
                </FormControlError>
            </FormControl>

            {/* Confirm Password */}
            <FormControl isInvalid={!!errors.confirmPassword}>
                <FormControlLabel>
                    <FormControlLabelText className={errors.confirmPassword ? 'text-destructive' : 'text-secondary-foreground'}>
                        Confirm Password
                    </FormControlLabelText>
                </FormControlLabel>
                <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input className={`bg-secondary-foreground ${errors.confirmPassword ? 'border-2 border-destructive' : ''}`}>
                            <InputSlot className="pl-3">
                                <InputIcon as={Lock} className="text-muted-foreground" />
                            </InputSlot>
                            <InputField
                                placeholder="••••••••"
                                secureTextEntry={!showConfirm}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            <Button variant="ghost" onPress={() => setShowConfirm(!showConfirm)}>
                                <ButtonIcon as={showConfirm ? Eye : EyeClosed} className="text-muted-foreground" />
                            </Button>
                        </Input>
                    )}
                />
                <FormControlError>
                    <FormControlErrorText>{errors.confirmPassword?.message}</FormControlErrorText>
                </FormControlError>
            </FormControl>

            <Button className="w-full py-3 bg-primary" size="lg" onPress={handleNext}>
                <ButtonText className="text-secondary-foreground text-lg">Next</ButtonText>
            </Button>

            <Box className="flex-row items-center justify-center gap-1">
                <Text size="sm" className="text-secondary-foreground/60">Already have an account?</Text>
                <Pressable onPress={() => router.push('/login')}>
                    <Text size="sm" className="text-primary font-bold underline">Sign in</Text>
                </Pressable>
            </Box>
        </Box>
    )
}
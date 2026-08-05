import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView } from 'react-native'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '@/components/ui/button'
import {
    Select,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectIcon,
    SelectItem,
    SelectPortal,
    SelectTrigger,
} from '@/components/ui/select'
import { DateTimePicker, DateTimePickerTrigger, DateTimePickerIcon } from '@/components/ui/date-time-picker'
import { SafeAreaView } from '@/components/ui/safe-area-view'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignUpForm, signUpSchema } from '@/zod/auth'
import {
    ArrowLeft,
    CalendarDays,
    ChevronDown,
    Crosshair,
    Globe,
    Map,
} from 'lucide-react-native'
import useAppToast from '@/hooks/useAppToast'
import { useLocation } from '@/hooks/useLocation'
import useLocationPickerStore from '@/stores/locationPickerStore'
import Step1 from '@/components/register/step-1'
import { HStack } from '@/components/ui/hstack'
import { authClient } from '@/lib/auth-client'
import { AuthButton, AuthDateTimePickerInput, AuthField, AuthInput, AuthInputField, AuthSelectInput } from '@/features/auth'


const COUNTRIES = ['Zambia', 'Zimbabwe', 'Malawi', 'Tanzania']
const CITIES = ['Lusaka', 'Ndola', 'Kitwe', 'Livingstone']

/** Field shell shared with `AuthInput`, applied to the Select / date-picker triggers. */
const TRIGGER_SHELL = 'h-12 rounded-[14px] border-[1.5px] border-border bg-card px-[14px]'

export default function Register() {
    const router = useRouter();
    const toast = useAppToast();
    const [step, setStep] = useState<1 | 2>(1)
    const [address, setAddress] = useState<string | null>(null)
    const { locating, error: locationError, getCurrentLocation, reverseGeocode } = useLocation()
    const picked = useLocationPickerStore((s) => s.picked)
    const clearPicked = useLocationPickerStore((s) => s.clear)

    const {
        control,
        handleSubmit,
        trigger,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SignUpForm>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
            country: '',
            city: '',
            town: '',
            location: undefined,
            birthday: '',
        },
    })

    const handleRegister = async (data: SignUpForm) => {

        try {
            const { error } = await authClient.signUp.email({
                name: data.name,
                phone: data.phone,
                email: data.email,
                password: data.password,
                country: data.country,
                city: data.city,
                town: data.town,
                birthday: data.birthday,
                address: JSON.stringify(data.location)
            });

            if (error) {
                console.error('Registration error:', error);
                toast.error('Something went wrong.', { title: 'Registration failed' });
                return;
            }

            router.replace("/");
        } catch (err) {
            // Transport-level failure (server unreachable) rejects instead of
            // returning `error`, so it has to be caught to avoid an unhandled promise.
            console.error('Registration request failed:', err);
            toast.error('Cannot reach the server. Check your connection and try again.', { title: 'Registration failed' });
        }
    }

    // Apply a point chosen on the full-screen map picker back into the form.
    useEffect(() => {
        if (!picked) return
        setValue(
            'location',
            { latitude: picked.latitude, longitude: picked.longitude },
            { shouldValidate: true },
        )
        setAddress(picked.address ?? null)
        clearPicked()
    }, [picked, setValue, clearPicked])

    const captureLocation = async (
        onChange: (value: { latitude: number; longitude: number }) => void,
    ) => {
        const coords = await getCurrentLocation()
        if (!coords) return
        onChange(coords)
        setAddress(await reverseGeocode(coords))
    }

    // Step 1's chevron leaves the flow; step 2's walks back a step.
    const handleBack = () => (step === 1 ? router.back() : setStep(1))

    return (
        // Headerless stack screen with no tab bar, so both edges are ours to clear.
        <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background">
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    className="bg-background"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Box className="flex-1 bg-background px-5.5 pb-4.5 pt-3.5">

                        {/* Header */}
                        <HStack className="mb-3 items-center gap-3">
                            <Pressable
                                onPress={handleBack}
                                hitSlop={12}
                                accessibilityRole="button"
                                accessibilityLabel="Go back"
                            >
                                <Box className="size-7 items-center justify-center rounded-full border border-border bg-card">
                                    <ArrowLeft  color="#7A5540"  size={15}/>
                                </Box>

                            </Pressable>
                            <Text className="font-poppins-medium text-[11px] text-muted-foreground">
                                Step {step} of 2
                            </Text>
                        </HStack>

                        <HStack className="mb-4.5 gap-[6px]">
                            <Box className="h-[5px] flex-1 rounded-[3px] bg-primary" />
                            <Box className={`h-[5px] flex-1 rounded-[3px] ${step === 2 ? 'bg-primary' : 'bg-border'}`} />
                        </HStack>

                        <Text className="font-playfair text-[23px] leading-[28px] text-foreground">
                            {step === 1 ? 'Create your account' : 'Almost there'}
                        </Text>
                        <Text className="mb-[18px] mt-[3px] font-poppins text-[12px] text-muted-foreground">
                            {step === 1 ? 'A few details to get started' : 'Where should we deliver?'}
                        </Text>

                        {step === 1
                            ? (<Step1 errors={errors} control={control} watch={watch} trigger={trigger} setStep={setStep} />)
                            : (
                                <Box className="w-full gap-[13px]">
                                    <AuthField label="Country" error={errors.country?.message}>
                                        <Controller
                                            name="country"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Select selectedValue={value} onValueChange={onChange}>
                                                    <SelectTrigger
                                                        size="lg"
                                                        className={`${TRIGGER_SHELL} ${errors.country ? 'border-destructive' : ''}`}
                                                    >
                                                        <AuthSelectInput placeholder="Select country" className="flex-1" />
                                                        <SelectIcon as={ChevronDown} className="text-muted-foreground" />
                                                    </SelectTrigger>
                                                    <SelectPortal>
                                                        <SelectBackdrop />
                                                        <SelectContent>
                                                            <SelectDragIndicatorWrapper>
                                                                <SelectDragIndicator />
                                                            </SelectDragIndicatorWrapper>
                                                            {COUNTRIES.map((c) => (
                                                                <SelectItem key={c} label={c} value={c} />
                                                            ))}
                                                        </SelectContent>
                                                    </SelectPortal>
                                                </Select>
                                            )}
                                        />
                                    </AuthField>

                                    <AuthField label="City" error={errors.city?.message}>
                                        <Controller
                                            name="city"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Select selectedValue={value} onValueChange={onChange}>
                                                    <SelectTrigger
                                                        size="lg"
                                                        className={`${TRIGGER_SHELL} ${errors.city ? 'border-destructive' : ''}`}
                                                    >
                                                        <AuthSelectInput placeholder="Select city" className="flex-1" />
                                                        <SelectIcon as={ChevronDown} className="text-muted-foreground" />
                                                    </SelectTrigger>
                                                    <SelectPortal>
                                                        <SelectBackdrop />
                                                        <SelectContent>
                                                            <SelectDragIndicatorWrapper>
                                                                <SelectDragIndicator />
                                                            </SelectDragIndicatorWrapper>
                                                            {CITIES.map((c) => (
                                                                <SelectItem key={c} label={c} value={c} />
                                                            ))}
                                                        </SelectContent>
                                                    </SelectPortal>
                                                </Select>
                                            )}
                                        />
                                    </AuthField>

                                    <AuthField label="Town / area" error={errors.town?.message}>
                                        <Controller
                                            name="town"
                                            control={control}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <AuthInput height={48} isInvalid={!!errors.town}>
                                                    <AuthInputField
                                                        placeholder="e.g., Chelston, Lusaka"
                                                        onBlur={onBlur}
                                                        onChangeText={onChange}
                                                        value={value}
                                                    />
                                                </AuthInput>
                                            )}
                                        />
                                    </AuthField>

                                    <AuthField
                                        label="Delivery location"
                                        error={errors.location?.message}
                                        helper={
                                            locationError ? (
                                                <Text className="font-poppins text-[10.5px] text-destructive">
                                                    {locationError}
                                                </Text>
                                            ) : null
                                        }
                                    >
                                        <Controller
                                            name="location"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <HStack space="sm">
                                                        <Button
                                                            variant="outline"
                                                            className={`h-12 flex-1 justify-start rounded-[14px] border-[1.5px] bg-card px-3 ${errors.location ? 'border-destructive' : 'border-border'}`}
                                                            disabled={locating}
                                                            onPress={() => captureLocation(onChange)}
                                                        >
                                                            {locating ? (
                                                                <ButtonSpinner className="text-primary" />
                                                            ) : (
                                                                <ButtonIcon as={value ? Globe : Crosshair} className="text-primary" />
                                                            )}
                                                            <ButtonText className="font-poppins-medium text-[12px] text-foreground">
                                                                {value ? 'Update location' : 'Use current'}
                                                            </ButtonText>
                                                        </Button>
                                                        {/* <Button
                                                            variant="outline"
                                                            className={`h-12 flex-1 justify-start rounded-[14px] border-[1.5px] bg-card px-3 ${errors.location ? 'border-destructive' : 'border-border'}`}
                                                            onPress={() =>
                                                                router.push({
                                                                    pathname: '/location-picker',
                                                                    params: value
                                                                        ? { lat: String(value.latitude), lng: String(value.longitude) }
                                                                        : {},
                                                                })
                                                            }
                                                        >
                                                            <ButtonIcon as={Map} className="text-primary" />
                                                            <ButtonText className="font-poppins-medium text-[12px] text-foreground">
                                                                Choose on map
                                                            </ButtonText>
                                                        </Button> */}
                                                    </HStack>

                                                    {value ? (
                                                        <Box className="mt-2 gap-[2px] rounded-[12px] border border-border bg-muted px-3 py-2">
                                                            <Text selectable className="font-poppins-semibold text-[12px] text-foreground">
                                                                {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
                                                            </Text>
                                                            {address ? (
                                                                <Text className="font-poppins text-[10.5px] text-muted-foreground">{address}</Text>
                                                            ) : null}
                                                        </Box>
                                                    ) : null}
                                                </>
                                            )}
                                        />
                                    </AuthField>

                                    <AuthField
                                        label="Date of birth"
                                        optional
                                        helper={
                                            <Text className="font-poppins text-[10.5px] text-primary-strong">
                                                🎁 We&apos;ll send you a birthday reward
                                            </Text>
                                        }
                                    >
                                        <Controller
                                            name="birthday"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <DateTimePicker
                                                    mode="date"
                                                    value={value ? new Date(value) : undefined}
                                                    onChange={(date) => onChange(date ? date.toISOString() : '')}
                                                    maximumDate={new Date()}
                                                    placeholder="Select date of birth"
                                                    format="DD/MM/YYYY"
                                                >
                                                    <DateTimePickerTrigger className={TRIGGER_SHELL}>
                                                        <DateTimePickerIcon as={CalendarDays} className="mr-3 text-muted-foreground" />
                                                        <AuthDateTimePickerInput />
                                                    </DateTimePickerTrigger>
                                                </DateTimePicker>
                                            )}
                                        />
                                    </AuthField>

                                    <Box className="mt-2">
                                        <AuthButton
                                            label="Create Account"
                                            isLoading={isSubmitting}
                                            isDisabled={isSubmitting}
                                            onPress={handleSubmit(handleRegister)}
                                        />
                                    </Box>

                                    <Box className="flex-row items-center justify-center gap-1 pt-1">
                                        <Pressable onPress={() => setStep(1)} hitSlop={8} accessibilityRole="button">
                                            <Text className="font-poppins-semibold text-[12.5px] text-primary">‹ Back</Text>
                                        </Pressable>
                                        <Text className="font-poppins text-[12.5px] text-muted-foreground">to step 1</Text>
                                    </Box>

                                    <Text className="px-4 text-center font-poppins text-[10.5px] leading-4 text-muted-foreground/70">
                                        By creating an account, you agree to our{' '}
                                        <Text className="font-poppins-medium text-[10.5px] text-primary-strong">Terms of Service</Text>
                                        {' '}and{' '}
                                        <Text className="font-poppins-medium text-[10.5px] text-primary-strong">Privacy Policy</Text>.
                                    </Text>
                                </Box>
                            )}
                    </Box>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

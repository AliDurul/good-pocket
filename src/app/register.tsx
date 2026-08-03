import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native'
import { Box } from '@/components/ui/box'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '@/components/ui/button'
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
    Select,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectIcon,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger,
} from '@/components/ui/select'
import { Progress, ProgressFilledTrack } from '@/components/ui/progress'
import { DateTimePicker, DateTimePickerInput, DateTimePickerTrigger, DateTimePickerIcon } from '@/components/ui/date-time-picker'
import { Icon, useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignUpForm, signUpSchema } from '@/zod/auth'
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    ChevronDown,
    Crosshair,
    Globe,
    Map,
    MapPin,
} from 'lucide-react-native'
import useAppToast from '@/hooks/useAppToast'
import { useLocation } from '@/hooks/useLocation'
import useLocationPickerStore from '@/stores/locationPickerStore'
import Step1 from '@/components/register/step-1'
import { HStack } from '@/components/ui/hstack'
import { authClient } from '@/lib/auth-client'


const COUNTRIES = ['Zambia', 'Zimbabwe', 'Malawi', 'Tanzania']
const CITIES = ['Lusaka', 'Ndola', 'Kitwe', 'Livingstone']

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

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <Box className="flex-1 items-center justify-center bg-[#022e1f] px-6 py-12 gap-6">

                    {/* Header */}
                    <Box className="w-full gap-2">
                        <Heading size="2xl" className="text-center text-secondary-foreground">
                            {step === 1 ? 'Join Good Taste' : 'Almost there'}
                        </Heading>
                        <Text size="sm" className="text-center text-secondary-foreground/60">
                            Step {step} of 2
                        </Text>
                        <Progress value={step === 1 ? 50 : 100} className="w-full h-1.5 mt-2 bg-secondary-foreground/20">
                            <ProgressFilledTrack className="bg-primary" />
                        </Progress>
                    </Box>
                    {step === 1
                        ? (<Step1 errors={errors} control={control} watch={watch} trigger={trigger} setStep={setStep} />)
                        : (
                            <Box className="w-full gap-5">
                                {/* Country */}
                                <FormControl isInvalid={!!errors.country}>
                                    <FormControlLabel>
                                        <FormControlLabelText className={errors.country ? 'text-destructive' : 'text-secondary-foreground'}>
                                            Country
                                        </FormControlLabelText>
                                    </FormControlLabel>
                                    <Controller
                                        name="country"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select selectedValue={value} onValueChange={onChange}>
                                                <SelectTrigger size={'lg'} className={`bg-secondary-foreground ${errors.country ? 'border-2 border-destructive' : ''}`}>
                                                    <SelectInput placeholder="Select country" className="flex-1" />
                                                    <SelectIcon as={ChevronDown} className="mr-3 text-muted-foreground" />
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
                                    <FormControlError>
                                        <FormControlErrorText>{errors.country?.message}</FormControlErrorText>
                                    </FormControlError>
                                </FormControl>

                                {/* City */}
                                <FormControl isInvalid={!!errors.city}>
                                    <FormControlLabel>
                                        <FormControlLabelText className={errors.city ? 'text-destructive' : 'text-secondary-foreground'}>
                                            City
                                        </FormControlLabelText>
                                    </FormControlLabel>
                                    <Controller
                                        name="city"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select selectedValue={value} onValueChange={onChange}>
                                                <SelectTrigger size={'lg'} className={`bg-secondary-foreground ${errors.city ? 'border-2 border-destructive' : ''}`}>
                                                    <SelectInput placeholder="Select city" className="flex-1" />
                                                    <SelectIcon as={ChevronDown} className="mr-3 text-muted-foreground" />
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
                                    <FormControlError>
                                        <FormControlErrorText>{errors.city?.message}</FormControlErrorText>
                                    </FormControlError>
                                </FormControl>

                                {/* Town / Area */}
                                <FormControl isInvalid={!!errors.town}>
                                    <FormControlLabel>
                                        <FormControlLabelText className={errors.town ? 'text-destructive' : 'text-secondary-foreground'}>
                                            Town / Area
                                        </FormControlLabelText>
                                    </FormControlLabel>
                                    <Controller
                                        name="town"
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <Input className={`bg-secondary-foreground ${errors.town ? 'border-2 border-destructive' : ''}`}>
                                                <InputSlot className="pl-3">
                                                    <InputIcon as={MapPin} className="text-muted-foreground" />
                                                </InputSlot>
                                                <InputField
                                                    placeholder="e.g., Chelston, Lusaka"
                                                    onBlur={onBlur}
                                                    onChangeText={onChange}
                                                    value={value}
                                                />
                                            </Input>
                                        )}
                                    />
                                    <FormControlError>
                                        <FormControlErrorText>{errors.town?.message}</FormControlErrorText>
                                    </FormControlError>
                                </FormControl>

                                {/* Workspace Location */}
                                <FormControl isInvalid={!!errors.location}>
                                    <FormControlLabel>
                                        <FormControlLabelText className={errors.location ? 'text-destructive' : 'text-secondary-foreground'}>
                                            Workspace Location
                                        </FormControlLabelText>
                                    </FormControlLabel>
                                    <Controller
                                        name="location"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <HStack space='md'>
                                                    <Button
                                                        variant="outline"
                                                        className={`flex-1 h-13 justify-start bg-secondary-foreground ${errors.location ? 'border-2 border-destructive' : ''}`}
                                                        disabled={locating}
                                                        onPress={() => captureLocation(onChange)}
                                                    >
                                                        {locating ? (
                                                            <ButtonSpinner className="text-primary" />
                                                        ) : (
                                                            <ButtonIcon as={value ? Globe : Crosshair} className="text-primary" />
                                                        )}
                                                        <ButtonText className="text-foreground text-base">
                                                            {value ? 'Update my location' : 'Use current location'}
                                                        </ButtonText>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className={`flex-1 h-13 justify-start bg-secondary-foreground ${errors.location ? 'border-2 border-destructive' : ''}`}
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
                                                        <ButtonText className="text-foreground text-base">
                                                            Choose on map
                                                        </ButtonText>
                                                    </Button>

                                                </HStack>
                                                {value ? (
                                                    <Box className="rounded-md bg-secondary-foreground/10 px-3 py-2 gap-0.5 mt-1">
                                                        <Text selectable size="sm" className="text-secondary-foreground font-medium">
                                                            {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
                                                        </Text>
                                                        {address ? (
                                                            <Text size="xs" className="text-secondary-foreground/60">{address}</Text>
                                                        ) : null}
                                                    </Box>
                                                ) : null}
                                            </>

                                        )}
                                    />
                                    {locationError && (
                                        <FormControlHelper>
                                            <FormControlHelperText className="text-destructive">{locationError}</FormControlHelperText>
                                        </FormControlHelper>
                                    )}
                                    <FormControlError>
                                        <FormControlErrorText>{errors.location?.message}</FormControlErrorText>
                                    </FormControlError>
                                </FormControl>

                                {/* Date of Birth */}
                                <FormControl>
                                    <FormControlLabel>
                                        <FormControlLabelText className="text-secondary-foreground">
                                            Date of Birth
                                        </FormControlLabelText>
                                    </FormControlLabel>
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
                                                <DateTimePickerTrigger className="bg-secondary-foreground h-13 pl-4">
                                                    <DateTimePickerIcon as={CalendarDays} className="text-muted-foreground mr-3" />
                                                    <DateTimePickerInput className="text-foreground" />
                                                </DateTimePickerTrigger>
                                            </DateTimePicker>
                                        )}
                                    />
                                    <FormControlHelper>
                                        <FormControlHelperText className="text-secondary-foreground/60">
                                            🎁 We'll send you a birthday reward
                                        </FormControlHelperText>
                                    </FormControlHelper>
                                </FormControl>

                                <Button
                                    className="w-full py-3 bg-primary"
                                    size="lg"
                                    disabled={isSubmitting}
                                    onPress={handleSubmit(handleRegister)}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <ButtonSpinner color="white" />
                                            <ButtonText className="text-secondary-foreground text-lg">Please wait...</ButtonText>
                                        </>
                                    ) : (
                                        <>
                                            <ButtonText className="text-secondary-foreground text-lg">Create Account</ButtonText>
                                            <ButtonIcon as={ArrowRight} className="text-secondary-foreground" />
                                        </>
                                    )}
                                </Button>

                                {/* <Button variant="link" size='icon' onPress={() => setStep(1)} className="items-center">
                                    <ButtonIcon as={ChevronDown} className="rotate-180 text-secondary-foreground/60" />
                                    <ButtonText size="sm" className="text-secondary-foreground/60 underline">Back to Step 1</ButtonText>
                                </Button> */}

                                <Button variant="link" onPress={() => setStep(1)} className="items-center">
                                    <ButtonIcon
                                        as={ArrowLeft}
                                        className="size-4 text-secondary-foreground/60 ml-1"
                                    />
                                    <ButtonText className="font-medium text-secondary-foreground/60 underline underline-offset-2">
                                        Back to top stage 1
                                    </ButtonText>
                                </Button>

                                <Text size="xs" className="text-center text-secondary-foreground/40 px-4">
                                    By creating an account, you agree to our{' '}
                                    <Text size="xs" className="text-primary">Terms of Service</Text>
                                    {' '}and{' '}
                                    <Text size="xs" className="text-primary">Privacy Policy</Text>.
                                </Text>
                            </Box>
                        )}
                </Box>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

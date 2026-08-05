import React from 'react'
import { Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { SafeAreaView } from '@/components/ui/safe-area-view'
import { authClient } from "@/lib/auth-client";
import { useRouter } from 'expo-router';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { SignInForm, signInSchema } from '@/zod/auth'
import { useAppToast } from '@/hooks/useAppToast'
import { AuthButton, AuthField, AuthInput, AuthInputField, BrandMark } from '@/features/auth'

/**
 * Prefilled dev credentials, kept out of release builds so a shipped app never
 * opens with someone else's account already typed in.
 */
const DEV_DEFAULTS = __DEV__
    ? { email: 'customer1@gmail.com', password: 'Goodtaste2026' }
    : { email: '', password: '' }

export default function Login() {

    const [showPass, setShowPass] = React.useState(false);
    const router = useRouter();
    const toast = useAppToast();


    const { control, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<SignInForm>({
        resolver: zodResolver(signInSchema),
        defaultValues: DEV_DEFAULTS,
    });


    const handleSignIn = async (data: SignInForm) => {
        try {
            const { error } = await authClient.signIn.email({
                email: data.email,
                password: data.password,
            });

            if (error) {
                console.error('Login error:', error);
                toast.error(error.message ?? 'Sign in failed', { title: 'Login failed' });
                return;
            }

            router.replace("/");
        } catch (err) {
            // Transport-level failure (server unreachable) rejects instead of
            // returning `error`, so it has to be caught to avoid an unhandled promise.
            console.error('Login request failed:', err);
            toast.error('Cannot reach the server. Check your connection and try again.', { title: 'Login failed' });
        }
    };

    const revealLabel = showPass ? 'Hide' : 'Show'

    return (
        // Headerless stack screen with no tab bar, so both edges are ours to clear.
        <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background">
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    className="bg-background"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Box className="flex-1 bg-background px-6 py-5">

                        <Box className="my-5.5 items-center">
                            <BrandMark size="sm" />
                        </Box>

                        <Text className="text-center font-playfair text-[26px] leading-8 text-foreground">
                            Welcome back
                        </Text>
                        <Text className="mt-1 text-center font-poppins text-[13px] text-muted-foreground">
                            Sign in to your account
                        </Text>

                        <Box className="mt-6 gap-4">
                            <AuthField label="Email" error={errors.email?.message}>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <AuthInput isInvalid={!!errors.email}>
                                            <AuthInputField
                                                placeholder="you@example.com"
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

                            <AuthField label="Password" error={errors.password?.message}>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <AuthInput isInvalid={!!errors.password}>
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
                                                accessibilityLabel={`${revealLabel} password`}
                                            >
                                                <Text className="font-poppins-semibold text-[11px] text-primary">
                                                    {revealLabel}
                                                </Text>
                                            </Pressable>
                                        </AuthInput>
                                    )}
                                />
                            </AuthField>
                        </Box>

                        <Box className="mt-3 items-end">
                            <Pressable
                                onPress={() =>
                                    // Carry whatever is already typed so the reset screen can
                                    // show which address the code went to.
                                    router.push({
                                        pathname: '/forgot-password',
                                        params: { email: getValues('email') ?? '' },
                                    })
                                }
                                hitSlop={8}
                                accessibilityRole="button"
                            >
                                <Text className="font-poppins-medium text-[12px] text-primary">
                                    Forgot password?
                                </Text>
                            </Pressable>
                        </Box>

                        <Box className="mt-5">
                            <AuthButton
                                label="Sign In"
                                isLoading={isSubmitting}
                                isDisabled={isSubmitting}
                                onPress={handleSubmit(handleSignIn)}
                            />
                        </Box>

                        {/* <Box className="flex-1" /> */}

                        <Box className="flex-row items-center justify-center gap-1 pt-3">
                            <Text className="font-poppins text-[12.5px] text-muted-foreground">
                                New customer?
                            </Text>
                            <Pressable onPress={() => router.push('/register')} hitSlop={8} accessibilityRole="button">
                                <Text className="font-poppins-semibold text-[12.5px] text-primary">
                                    Register here
                                </Text>
                            </Pressable>
                        </Box>

                    </Box>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

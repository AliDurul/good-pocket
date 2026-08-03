import React from 'react'
import { Image, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { Box } from '@/components/ui/box'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Input, InputField, InputIcon } from '@/components/ui/input'
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '@/components/ui/button'
import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    FormControlError,
    FormControlErrorText,
} from '@/components/ui/form-control'
import { authClient } from "@/lib/auth-client";
import { useRouter } from 'expo-router';
import { useForm, Controller } from "react-hook-form";
import { Eye, EyeClosed } from 'lucide-react-native'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignInForm, signInSchema } from '@/zod/auth'
import { useAppToast } from '@/hooks/useAppToast'


export default function Login() {

    const [showPass, setShowPass] = React.useState(false);
    const router = useRouter();
    const toast = useAppToast();


    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInForm>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: 'customer1@gmail.com',
            password: 'Goodtaste2026',
        }
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

            // await authClient.getSession();
            // toast.success('Welcome back!');
            router.replace("/");
        } catch (err) {
            // Transport-level failure (server unreachable) rejects instead of
            // returning `error`, so it has to be caught to avoid an unhandled promise.
            console.error('Login request failed:', err);
            toast.error('Cannot reach the server. Check your connection and try again.', { title: 'Login failed' });
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

                <Box className="flex-1 items-center justify-center bg-[#022e1f] px-6 py-12 gap-6">

                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80' }}
                        style={{ width: 200, height: 200, borderRadius: 24 }}
                        resizeMode="contain"
                    />
                    <Heading size="2xl" className="text-center text-secondary-foreground" >Good Taste Club</Heading>

                    <Box className="w-full gap-6">
                        <FormControl isInvalid={!!errors.email}>
                            <FormControlLabel>
                                <FormControlLabelText className={errors.email ? "text-destructive" : "text-secondary-foreground"}>
                                    Email
                                </FormControlLabelText>
                            </FormControlLabel>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input className={`bg-secondary-foreground ${errors.email ? "data-[invalid=true]:border-destructive" : ""}`}>
                                        <InputField
                                            placeholder="you@example.com"
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
                                <FormControlErrorText className='text-base'>{errors.email?.message}</FormControlErrorText>
                            </FormControlError>
                        </FormControl>

                        <FormControl isInvalid={!!errors.password}>
                            <FormControlLabel>
                                <FormControlLabelText className={errors.password ? "text-destructive" : "text-secondary-foreground"}>
                                    Password
                                </FormControlLabelText>
                            </FormControlLabel>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input className={`bg-secondary-foreground ${errors.password ? "data-[invalid=true]:border-destructive" : ""}`}>
                                        <InputField
                                            placeholder="••••••••"
                                            secureTextEntry={!showPass}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                        <Button variant='ghost' onPress={() => setShowPass(!showPass)}>
                                            <ButtonIcon as={showPass ? Eye : EyeClosed} className='text-muted-foreground' />
                                        </Button>
                                    </Input>
                                )}
                            />
                            <FormControlError>
                                <FormControlErrorText className='text-base'>{errors.password?.message}</FormControlErrorText>
                            </FormControlError>
                        </FormControl>

                        <Box className="items-end">
                            <Pressable onPress={() => console.log('Forgot password')}>
                                <Text size="sm" className="text-secondary-foreground">Forgot password?</Text>
                            </Pressable>
                        </Box>
                    </Box>

                    <Button
                        className="w-full py-3 bg-[#917400]"
                        size='lg'
                        onPress={handleSubmit(handleSignIn)}
                    >
                        {isSubmitting ? (
                            <>
                                <ButtonSpinner color="white" />
                                <ButtonText className='text-secondary-foreground text-lg'>Please wait...</ButtonText>
                            </>
                        ) : (
                            <ButtonText className='text-secondary-foreground text-lg'>Sign In</ButtonText>
                        )}
                    </Button>

                    <Box className="flex-row items-center gap-1">
                        <Text size="sm" className="text-secondary-foreground">Don't have an account?</Text>
                        <Pressable onPress={() => router.push('/register')}>
                            <Text size="sm" className="text-primary/80 font-medium underline">Register</Text>
                        </Pressable>
                    </Box>

                </Box>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
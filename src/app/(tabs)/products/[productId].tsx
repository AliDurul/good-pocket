import { Box } from '@/components/ui/box'
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text'
import { Heading } from '@/components/ui/heading'
import { VStack } from '@/components/ui/vstack'
import { HStack } from '@/components/ui/hstack'
import { Card } from '@/components/ui/card'
import { Image } from '@/components/ui/image'
import { Spinner } from '@/components/ui/spinner'
import { Badge, BadgeText } from '@/components/ui/badge'
import { Button, ButtonText } from '@/components/ui/button'
import { ScrollView } from '@/components/ui/scroll-view'
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react'
import { useProduct } from '@/api/queries/products'
import type { IProductVariant } from '@/types'

export default function ProductDetail() {
  const params = useLocalSearchParams<{ productId: string }>();
  const { data, isPending, isError, error, refetch } = useProduct(params.productId);
  const product = data?.data;

  if (isPending) {
    return (
      <Center className="flex-1 bg-background gap-2">
        <Spinner />
        <Text className="text-foreground">Loading product…</Text>
      </Center>
    );
  }

  if (isError) {
    return (
      <Center className="flex-1 bg-background gap-3 px-6">
        <Text className="text-error-500 text-center">{error.message}</Text>
        <Button variant="outline" onPress={() => refetch()}>
          <ButtonText>Retry</ButtonText>
        </Button>
      </Center>
    );
  }

  if (!product) {
    return (
      <Center className="flex-1 bg-background">
        <Text className="text-foreground">Product not found</Text>
      </Center>
    );
  }

  return (
    <Box className="flex-1 bg-background">
      <Stack.Screen options={{ title: product.name }} />

      <ScrollView contentContainerClassName="gap-4 p-4">
        {product.image ? (
          <Image source={{ uri: product.image }} size="2xl" className="self-center rounded-lg" alt={product.name} />
        ) : (
          <Box className="h-32 w-32 self-center rounded-lg bg-secondary" />
        )}

        <VStack space="xs">
          <Heading size="xl">{product.name}</Heading>
          {product.category && (
            <Badge variant="outline" className="self-start">
              <BadgeText>{product.category.name}</BadgeText>
            </Badge>
          )}
          {product.description && (
            <Text className="text-muted-foreground">{product.description}</Text>
          )}
        </VStack>

        {product.variants && product.variants.length > 0 && (
          <VStack space="sm">
            <Heading size="sm">Variants</Heading>
            {product.variants.map((variant: IProductVariant) => (
              <Card key={variant.id} size="sm">
                <HStack className="items-center justify-between">
                  <VStack>
                    <Text className="text-foreground font-medium">{variant.weightLabel}</Text>
                    <Text size="xs" className="text-muted-foreground">
                      {variant.isOutOfStock ? 'Out of stock' : `${variant.stockQty} in stock`}
                    </Text>
                  </VStack>
                  <Text className="text-foreground font-semibold">${variant.price.toFixed(2)}</Text>
                </HStack>
              </Card>
            ))}
          </VStack>
        )}

        <Link href="/products/" className="self-center">
          <Text className="text-primary">Back to product list</Text>
        </Link>
      </ScrollView>
    </Box>
  )
}

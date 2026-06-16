import React from 'react';
import { ActivityIndicator, View } from 'react-native';

type Props = {
    isLoading: boolean;
};

const LoadingOverlay = ({ isLoading }: Props) => {
    if (!isLoading) return null;

    return (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/15 flex items-center justify-center z-50">
            <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
    );
};

export default LoadingOverlay;
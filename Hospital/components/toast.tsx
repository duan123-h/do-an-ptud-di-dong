import Toast from 'react-native-toast-message';

export const showError = (message: string) => {
  Toast.show({
    type: 'error',
    text1: 'Lỗi',
    text2: message,
    position: 'top',

    text1Style: {
      fontSize: 18,
      fontWeight: 'bold',
    },

    text2Style: {
      fontSize: 16,
    },
  });
};

export const showSuccess = (message: string) => {
  Toast.show({
    type: 'success',
    text1: 'Thành công',
    text2: message,

    text1Style: {
      fontSize: 18,
      fontWeight: 'bold',
    },

    text2Style: {
      fontSize: 16,
    },
  });
};
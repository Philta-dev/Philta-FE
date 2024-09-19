import React, {useEffect, useState} from 'react';
import AppInner from './AppInner';
import {Provider} from 'react-redux';
import store from './src/store';
import {Platform, Pressable, StyleSheet, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  PurchaseError,
  Subscription,
  SubscriptionPurchase,
  clearProductsIOS,
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
  getAvailablePurchases,
  getSubscriptions,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestSubscription,
  validateReceiptIos,
  validateReceiptAndroid,
} from 'react-native-iap';
import Text from './src/components/TextBold';

function App() {
  let purchaseUpdateSubscription: any;
  let purchaseErrorSubscription: any;

  const [subscription, setSubscription] = useState<Subscription | undefined>();
  const [receipt, setReceipt] = useState('');

  const purchase = async () => {
    console.log('purchase');
    if (Platform.OS == 'ios') clearProductsIOS();
    try {
      console.log('initConnection');
      const result = await initConnection();
      if (Platform.OS == 'android')
        await flushFailedPurchasesCachedAsPendingAndroid();
      console.log('res', result);
    } catch (error) {
      console.log('error in initConnection', error);
    }

    purchaseUpdateSubscription = purchaseUpdatedListener(
      (purchase: SubscriptionPurchase) => {
        console.log('purchaseUpdatedListener', purchase);
        const receipt =
          Platform.OS == 'ios'
            ? purchase.transactionReceipt
            : purchase.purchaseToken;
        if (receipt) {
          console.log('receipt', receipt);
          finishTransaction({purchase});
          setReceipt(receipt);
        }
      },
    );

    purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        console.warn('purchaseErrorListener', error);
      },
    );

    const subscriptions = await getSubscriptions({
      skus: ['test'],
    });
    console.log('subscriptions', subscriptions);
    setSubscription(subscriptions[0]);
  };

  const _requestSubscription = () => {
    console.log('requestSubscription');
    if (subscription) {
      requestSubscription({
        sku: subscription.productId,
      });
    }
  };

  // 안함
  const chheckReceiptIOS = async () => {
    let isValidated = false;
  };

  const _restoreSubscription = () => {
    console.log('restoreSubscription');
    getAvailablePurchases()
      .then(purchases => {
        console.log('getAvailablePurchases', purchases);
        if (purchases.length > 0) {
          let receipt = purchases[0].transactionReceipt;
          if (Platform.OS == 'android' && purchases[0].purchaseToken) {
            receipt = purchases[0].purchaseToken;
          }
          console.log('receipt', receipt);
          setReceipt(receipt);
        }
      })
      .catch(error => {
        console.log('getAvailablePurchases', error);
      });
  };

  // useEffect(() => {
  //   purchase();
  //   return () => {
  //     if (purchaseUpdateSubscription) {
  //       purchaseUpdateSubscription.remove();
  //     }
  //     if (purchaseErrorSubscription) {
  //       purchaseErrorSubscription.remove();
  //     }
  //   };
  // }, []);
  return (
    <Provider store={store}>
      {Platform.OS === 'ios' ? (
        // <>
        //   <View style={{flexDirection: 'row'}}>
        //     <Pressable
        //       style={{backgroundColor: 'red', width: 100, height: 100}}
        //       onPress={() => {
        //         _requestSubscription();
        //         console.log('press');
        //       }}>
        //       <Text>text</Text>
        //     </Pressable>
        //     <Pressable
        //       style={{backgroundColor: 'blue', width: 100, height: 100}}
        //       onPress={() => {
        //         _restoreSubscription();
        //         console.log('press');
        //       }}>
        //       <Text>restore</Text>
        //     </Pressable>
        //     <Pressable
        //       style={{backgroundColor: 'green', width: 100, height: 100}}
        //       onPress={async () => {
        //         console.log('receipt', receipt);
        //         const res = await validateReceiptIos({
        //           receiptBody: {
        //             'receipt-data': receipt,
        //             password: '7f947091bfd941258601fb4abadc96bf',
        //           },
        //           isTest: true,
        //         });
        //         console.log('press', res);
        //       }}>
        //       <Text>validate</Text>
        //     </Pressable>
        //   </View>
        // </>
        <AppInner />
      ) : (
        <SafeAreaProvider>
          {/* <>
            <Pressable
              onPress={() => {
                _requestSubscription();
                console.log('press');
              }}>
              <Text>text</Text>
            </Pressable>
          </> */}
          <AppInner />
        </SafeAreaProvider>
      )}
    </Provider>
  );
}

export default App;

const styles = StyleSheet.create({});

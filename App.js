import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Button,
} from "react-native";
import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, onValue, remove } from "firebase/database";
import React, { useState, useEffect } from "react";
import { config } from "dotenv";
config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

export default function App() {
  const [amount, setAmount] = useState("");
  const [product, setProduct] = useState("");
  const [items, setItems] = useState([]);

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const saveItem = () => {
    push(ref(database, "Items/"), { product: product, amount: amount });
  };

  const deleteItem = (id) => {
    const itemRef = ref(database, `Items/${id}`);
    remove(itemRef)
      .then(() => console.log("Item removed successfully"))
      .catch((error) => console.error("Error removing item:", error));
  };

  useEffect(() => {
    const itemsRef = ref(database, "tems/");
    onValue(
      itemsRef,
      (snapshot) => {
        const data = snapshot.val();
        console.log("data:", data);
        if (data) {
          const itemsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setItems(itemsArray);
        }
      },
      (error) => {
        console.log("onValue error:", error);
      }
    );
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.button}>Firebase shopping</Text>

      <TextInput
        style={styles.TextInput}
        placeholder="product"
        onChangeText={(product) => setProduct(product)}
        value={product}
      />
      <TextInput
        style={styles.TextInput}
        placeholder="amount"
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
      />
      <View style={styles.button}>
        <Button onPress={saveItem} title="save" />
      </View>
      <FlatList
        style={styles.FlatList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listcontainer}>
            <Text>
              {item.product},{item.amount}
            </Text>
            <Text style={{ color: "red" }} onPress={() => deleteItem(item.id)}>
              bought
            </Text>
          </View>
        )}
        data={items}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  FlatList: {
    marginTop: 100,
  },
  button: {
    marginTop: 20,
  },
  TextInput: {
    margin: 20,
    padding: 10,
  },
});

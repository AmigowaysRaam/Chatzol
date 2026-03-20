import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { sendRequest } from "../redux/authActions";
import API from "../api/api-end-points";

export default function ServerDown({ navigation }) {

  const [loading, setLoading] = useState(false);

  const retry = async () => {
    try {
      setLoading(true);

      await sendRequest({
        url: API.API_SITE_URL,
        method: "GET", // ✅ important
      });

      // ✅ Reset navigation (best practice)
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });

    } catch (e) {
      // still down → stay here
      console.log("Still down...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex:1, justifyContent:"center", alignItems:"center", padding:20 }}>

      <Text style={{ fontSize:22, fontWeight:"bold" }}>
        Server Down
      </Text>

      <Text style={{ marginVertical:15, textAlign:"center" }}>
        Please try again later
      </Text>

      <TouchableOpacity
        onPress={retry}
        disabled={loading}
        style={{
          backgroundColor:"#000",
          padding:12,
          borderRadius:8,
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color:"#fff" }}>Retry</Text>
        )}
      </TouchableOpacity>

    </View>
  );
}
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Auth Screens */}
      {/* <Stack.Screen name="home" /> */}
      <Stack.Screen name="signup" /> {/* Register */}
      <Stack.Screen name="home" /> {/* Home / Products */}
      <Stack.Screen name="logout" /> {/* Home / Products */}
      <Stack.Screen name="seller/dashboard" /> {/* Seller / dashboard */}
      <Stack.Screen name="seller/add-product" /> {/* Seller / Add Products */}
      <Stack.Screen name="seller/my-products" /> {/* Seller / My products */}
      <Stack.Screen name="seller/edit-product" /> {/* Seller / Edit products */}
      <Stack.Screen name="seller/inquiries" />{" "}
      <Stack.Screen name="seller/delete-product" />{" "}
      <Stack.Screen name="seller/advertise-with-us" />{" "}
      {/* Seller / inquiries products */}
      <Stack.Screen name="seller/reply-inquiry" />{" "}
      {/* Seller / reply products */}
      <Stack.Screen name="buyer/chat" /> {/* Buyer / chat UI */}
      <Stack.Screen name="/buyer/search-results" /> {/* Buyer / chat UI */}
      <Stack.Screen name="buyer/browse-products" /> {/* Buyer / chat UI */}
      <Stack.Screen name="buyer/CategoryDetailScreen" /> {/* Buyer / chat UI */}
      <Stack.Screen name="profile/edit-personal-details" />{" "}
      <Stack.Screen name="buyer/post-buy-requirement" />{" "}
      <Stack.Screen name="buyer/state-companies" />{" "}
      <Stack.Screen name="blogs" /> {/* Footer Pages */}
      <Stack.Screen name="FooterPages/industries" />
      <Stack.Screen name="FooterPages/MakePayment" />
      <Stack.Screen name="FooterPages/leads" />
      <Stack.Screen name="FooterPages/sitemap" />
      <Stack.Screen name="FooterPages/about" />
      <Stack.Screen name="FooterPages/contact" />
      <Stack.Screen name="catelogue/" />
    </Stack>
  );
}

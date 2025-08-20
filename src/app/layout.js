import "./globals.css";
import ToastContainerComponent from "../components/ToastContainer";
import Header from "../components/Header";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "../components/theme-provider";

export const metadata = {
  title: "Social Dealer App",
  description:
    "This app is Created to avoid scams with people who deal their social accounts on social media",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader color="#155dfc" showSpinner={false} />
          <ToastContainerComponent />
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

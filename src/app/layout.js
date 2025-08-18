import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastContainerComponent from "./component/ToastContainer";
import ProgressBarComponent from "./component/ProgressBar";
import Header from "./component/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Social Dealer App",
  description: "This app is Created to avoid scams with people who deal their social accounts on social media",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProgressBarComponent />
        <ToastContainerComponent />
        <Header />
        {children}
      </body>
    </html>
  );
}

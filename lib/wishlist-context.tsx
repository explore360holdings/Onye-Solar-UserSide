// File: /lib/wishlist-context.tsx
"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast'; // Import useToast

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => boolean; // Returns true if added, false if removed
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('solar_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (error) {
      console.error("Failed to parse wishlist from localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('solar_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (item: WishlistItem): boolean => {
    const isAlreadyInWishlist = wishlist.some(i => i.id === item.id);
    
    if (isAlreadyInWishlist) {
      setWishlist((prev) => prev.filter(i => i.id !== item.id));
      return false; // Removed
    } else {
      setWishlist((prev) => [...prev, item]);
      return true; // Added
    }
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWishlist = (id: string) => {
    return wishlist.some(item => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};



// // File: /lib/wishlist-context.tsx
// "use client"

// import React, { createContext, useContext, useState, useEffect } from 'react';

// // Define the shape of a wishlist item
// export interface WishlistItem {
//   id: string;
//   name: string;
//   price: number;
//   image: string;
// }

// // Define the shape of the context value
// interface WishlistContextType {
//   wishlist: WishlistItem[];
//   addToWishlist: (item: WishlistItem) => void;
//   removeFromWishlist: (id: string) => void;
//   isInWishlist: (id: string) => boolean;
// }

// // Create the context with a default undefined value
// const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// // Create the provider component
// export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
//   const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

//   // On initial load, try to get the wishlist from localStorage
//   useEffect(() => {
//     try {
//       const savedWishlist = localStorage.getItem('wishlist');
//       if (savedWishlist) {
//         setWishlist(JSON.parse(savedWishlist));
//       }
//     } catch (error) {
//       console.error("Failed to parse wishlist from localStorage", error);
//     }
//   }, []);

//   // Whenever the wishlist changes, save it to localStorage
//   useEffect(() => {
//     localStorage.setItem('wishlist', JSON.stringify(wishlist));
//   }, [wishlist]);

//   const addToWishlist = (item: WishlistItem) => {
//     setWishlist((prev) => {
//       // Prevent duplicates
//       if (prev.some(i => i.id === item.id)) {
//         return prev;
//       }
//       return [...prev, item];
//     });
//   };

//   const removeFromWishlist = (id: string) => {
//     setWishlist((prev) => prev.filter((item) => item.id !== id));
//   };

//   const isInWishlist = (id: string) => {
//     return wishlist.some(item => item.id === id);
//   };

//   return (
//     <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
//       {children}
//     </WishlistContext.Provider>
//   );
// };

// export const useWishlist = () => {
//   const context = useContext(WishlistContext);
//   if (context === undefined) {
//     throw new Error('useWishlist must be used within a WishlistProvider');
//   }
//   return context;
// };

// // // File: lib/wishlist-context.tsx

// // "use client";

// // import { createContext, useContext, useState, useEffect } from 'react';

// // export interface WishlistItem {
// //   id: string;
// //   name: string;
// //   price: number;
// //   image: string;
// // }

// // interface WishlistContextType {
// //   wishlist: WishlistItem[];
// //   addToWishlist: (item: WishlistItem) => void;
// //   removeFromWishlist: (id: string) => void;
// //   isItemInWishlist: (id: string) => boolean;
// // }

// // const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// // export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
// //   const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

// //   useEffect(() => {
// //     const savedWishlist = localStorage.getItem("solar_wishlist");
// //     if (savedWishlist) {
// //       setWishlist(JSON.parse(savedWishlist));
// //     }
// //   }, []);

// //   useEffect(() => {
// //     if (wishlist.length > 0) {
// //       localStorage.setItem("solar_wishlist", JSON.stringify(wishlist));
// //     } else {
// //       localStorage.removeItem("solar_wishlist");
// //     }
// //   }, [wishlist]);

// //   const addToWishlist = (item: WishlistItem) => {
// //     setWishlist(prev => {
// //       const isAlreadyAdded = prev.some(wishlistItem => wishlistItem.id === item.id);
// //       if (isAlreadyAdded) return prev;
// //       return [...prev, item];
// //     });
// //   };

// //   const removeFromWishlist = (id: string) => {
// //     setWishlist(prev => prev.filter(item => item.id !== id));
// //   };

// //   const isItemInWishlist = (id: string) => {
// //     return wishlist.some(item => item.id === id);
// //   };

// //   return (
// //     <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isItemInWishlist }}>
// //       {children}
// //     </WishlistContext.Provider>
// //   );
// // };

// // export const useWishlist = () => {
// //   const context = useContext(WishlistContext);
// //   if (context === undefined) {
// //     throw new Error('useWishlist must be used within a WishlistProvider');
// //   }
// //   return context;
// // };
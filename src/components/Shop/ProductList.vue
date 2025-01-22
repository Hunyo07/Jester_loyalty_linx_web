<template>
  <ShopNav @search-query="filterProductsBySearch" />

  <div class="max-w-7xl mx-auto p-2 bg-white">
    <!-- Carousel Section for Ads -->
    <div class="mb-2 relative">
      <div
        class="absolute top-4 left-4 bg-black bg-opacity-50 px-4 py-2 rounded-sm"
      >
        <h2 class="text-white text-2xl font-semibold">Our Deals</h2>
      </div>
      <div class="relative w-full h-30 overflow-hidden rounded-sm">
        <div
          class="carousel flex transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div
            v-for="(image, index) in adImages"
            :key="index"
            class="w-full h-64 flex-shrink-0"
          >
            <img
              :src="getImageUrl(image)"
              :alt="`Ad ${index + 1}`"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
        <!-- Carousel Navigation Dots -->
        <div
          class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2"
        >
          <span
            v-for="(image, index) in adImages"
            :key="index"
            class="h-3 w-3 rounded-full cursor-pointer"
            :class="{
              'bg-orange-500': currentSlide === index,
              'bg-gray-300': currentSlide !== index,
            }"
            @click="setCurrentSlide(index)"
          ></span>
        </div>
      </div>
    </div>

    <!-- <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">
      Product List
    </h1> -->

    <!-- Credit Score Section -->
    <div class="mb-2">
      <div class="p-3 rounded-sm flex flex-col items-center bg-[#3D3BF3]">
        <!-- <div
        class="p-6 rounded-sm shadow-md"
        :class="['bg-gradient-to-r', 'from-amber-300', 'to-amber-600']"
      > -->
        <h2 class="text-3xl font-bold text-[#EBEAFF] mb-2">
          {{
            new Intl.NumberFormat("en-PH", {
              style: "decimal",
              minimumFractionDigits: 2,
            }).format(creditsBalance)
          }}
        </h2>
        <h1 class="text-gray-300 font-semibold text-sm">Available Credits</h1>
      </div>
    </div>

    <!-- Scrollable Category Buttons -->
    <div class="p-1 mb-2 rounded-sm">
      <div class="px-2 py-1">
        <h1 class="text-[#4635B1] font-bold text-lg">CATEGORIES</h1>
      </div>
      <div
        class="overflow-x-auto whitespace-nowrap no-scrollbar flex space-x-2 px-2"
      >
        <!-- <button
          v-for="category in categories"
          :key="category._id"
          @click="filterProductsByCategory(category._id)"
          class="px-4 py-2 border border-[#4635B1] shadow-1 text-[#4635B1] rounded-sm hover:bg-white"
        >
          {{ category.categoryName }}
        </button> -->
      </div>
      <div
        class="overflow-x-auto whitespace-nowrap no-scrollbar flex space-x-2 px-2"
      >
        <button
          v-for="category in tempCategories"
          :key="category._id"
          @click="filterProductsByCategory(category._id)"
          class="px-4 py-2 border text-[#4635B1] rounded-sm hover:bg-white flex items-center"
        >
          <div class="flex flex-col w-20">
            <img
              class="w-[2.5em] object-contain mx-auto"
              :src="category.path"
              alt=""
            />

            <p class="text-sm">
              {{ category.categoryName }}
            </p>
          </div>
        </button>
      </div>

      <!-- Loading state -->
      <div
        v-if="loading"
        class="text-center text-lg font-semibold text-gray-600"
      >
        Loading...
      </div>
    </div>

    <!-- No products available message -->
    <div
      v-if="!loading && filteredProducts.length === 0"
      class="text-center text-lg font-semibold text-gray-600"
    >
      No products available.
    </div>

    <!-- Products Grid -->
    <div
      v-if="!loading"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 mb-20"
    >
      <div
        v-for="product in filteredProducts"
        :key="product._id"
        class="bg-white border p-3 rounded-sm flex flex-col cursor-pointer"
        @click="goToProductDetails(product._id)"
      >
        <div class="h-60 flex items-center">
          <img
            v-if="product.image"
            :src="product.image"
            alt="Product Image"
            class="w-auto h-auto object-cover rounded-sm"
          />
        </div>
        <div class="flex-grow">
          <h2 class="text-md text-gray-800 mb-1 mt-1">
            {{ truncateName(product.name) }}
          </h2>
          <p class="text-lg font-bold text-gray-700 mb-2">
            ₱{{ product.price.toFixed(2) }}
          </p>
        </div>
        <!-- Add to Cart button -->
        <button
          @click.stop="addToCart(product)"
          class="bg-[#4635B1] border text-white px-4 py-2 rounded hover:bg-blue-800 mt-2"
        >
          <!-- <img
            src="../../assets/img/shop/furniture.svg"
            alt="Cart"
            class="h-4 w-4 inline-block"
          /> -->
          <span class="text- text-white">Add to Cart </span>
        </button>
      </div>
    </div>
  </div>
  <!-- <NavBar /> -->
  <BottomNavigation />
</template>

<script>
import Swal from "sweetalert2";
import ShopNav from "../NavBar/ShopNav.vue";
import BottomNavigation from "../NavBar/BottomNavigation.vue";
import Toys from "../../assets/img/shop/toys.svg";
import Furniture from "../../assets/img/shop/furniture.svg";
import Clothes from "../../assets/img/shop/clothes.svg";
import Accesories from "../../assets/img/shop/accesories.svg";
import Appliances from "../../assets/img/shop/appliances.svg";

export default {
  computed: {
    truncatedName() {
      return this.product.name.length > 20
        ? this.product.name.substring(0, 20) + "..."
        : this.product.name;
    },
  },
  components: {
    ShopNav,
    BottomNavigation,
    Toys,
    Furniture,
    Clothes,
    Accesories,
    Appliances,
    // NavBar,
  },
  data() {
    return {
      token: JSON.parse(localStorage.getItem("token")),
      creditsBalance: JSON.parse(sessionStorage.getItem("u_CRDBAl")),
      products: [],
      filteredProducts: [],
      categories: [],
      loading: true,
      tempCategories: [
        {
          _id: "66e91ae8cb16e21cf32d38eb",
          categoryName: " Toys",
          path: Toys,
        },
        {
          _id: "66e91ae2cb16e21cf32d38e8",
          categoryName: "Furniture",
          path: Furniture,
        },
        {
          _id: "66e91a890b479e702d0f8825",
          categoryName: "Clothes",
          path: Clothes,
        },
        {
          _id: "66e91aeecb16e21cf32d38ee",
          categoryName: " Accessories",
          path: Accesories,
        },
        {
          _id: "66e91adacb16e21cf32d38e5",
          categoryName: " Electronics",
          path: Appliances,
        },
      ],
      searchQuery: "",
      adImages: ["ad1.jpg", "ad2.jpg", "ad3.jpg", "ad4.jpg"],
      currentSlide: 0,
    };
  },
  async created() {
    await this.fetchProducts();
    await this.fetchCategories();
    this.startCarousel();
  },

  methods: {
    truncateName(text) {
      return text.length > 20 ? text.substring(0, 20) + "..." : text;
      s;
    },
    getImageUrl(image) {
      // return new URL(`../assets/images/ads/${image}`, import.meta.url).href;
      return new URL(`../../assets/img/ads/${image}`, import.meta.url).href;
    },
    goToProductDetails(productId) {
      this.$router.push({ name: "product/details", params: { id: productId } });
    },

    async fetchProducts() {
      try {
        let url = "http://localhost:5000/api/product/products";
        if (this.searchQuery) {
          url += `?searchQuery=${encodeURIComponent(this.searchQuery)}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        this.products = data.allProduct.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        this.filteredProducts = this.products;
      } catch (error) {
        console.error("Error fetching products:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while fetching products",
          timer: 1500,
        });
      } finally {
        this.loading = false;
      }
    },
    async fetchCategories() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/category/getAllCategories"
        );
        const data = await response.json();
        this.categories = data.allCategories;
      } catch (error) {
        console.error("Error fetching categories:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch categories",
        });
      }
    },
    filterProductsByCategory(categoryId) {
      this.filteredProducts = this.products.filter(
        (product) => product.categoryId === categoryId
      );
    },
    filterProductsBySearch(query) {
      this.searchQuery = query;
      this.fetchProducts();
    },
    setCurrentSlide(index) {
      this.currentSlide = index;
    },
    startCarousel() {
      setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % this.adImages.length;
      }, 3000);
    },
    // Add to Cart logic
    async addToCart(product) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/user/add-to-cart",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.token.token}`,
            },
            body: JSON.stringify({
              productId: product._id,
              quantity: 1,
            }),
          }
        );
        const data = response.json();
        if (response.ok) {
          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          const productInCart = cart.find((item) => item._id === product._id);
          if (productInCart) {
            productInCart.quantity += 1; // If product exists, increase the quantity
          } else {
            cart.push({ ...product, quantity: 1 }); // If not, add the product with quantity 1
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          Swal.fire({
            icon: "success",
            text: `${product.name} has been added to your cart!`,
            showConfirmButton: false,
            timer: 1300,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "",
            text: `${product.name} has already added to your cart!`,
          });
          // console.log("failed" + data);
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "",
          text: `${error} `,
        });
      }
    },
  },
};
</script>

<style scoped>
/* Add this to your CSS file */
@media only screen and (max-width: 768px) {
  .grid-cols-1.sm\:grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

<script setup>
import { ref, reactive, defineEmits } from "vue";

const props = defineProps({
  default: String,

  digitCount: {
    type: Number,
    required: true,
  },
});

const digits = reactive([]);

if (props.default && props.default.length === props.digitCount) {
  for (let i = 0; i < props.digitCount; i++) {
    digits[i] = props.default.charAt(i);
  }
} else {
  for (let i = 0; i < props.digitCount; i++) {
    digits[i] = null;
  }
}

const otpCont = ref(null);

const emit = defineEmits(["update:otp"]);

const isDigitsFull = function () {
  for (const elem of digits) {
    if (elem == null || elem == undefined) {
      return false;
    }
  }

  return true;
};



const handleKeyDown = function (event, index) {
  if (
    event.key !== "Tab" &&
    event.key !== "ArrowRight" &&
    event.key !== "ArrowLeft"
  ) {
    event.preventDefault();
  }

  if (event.key === "Backspace") {
    digits[index] = null;

    if (index != 0) {
      otpCont.value.children[index - 1].focus();
    }

    return;
  }

  if (new RegExp("^([0-9])$").test(event.key)) {
    digits[index] = event.key;

    if (index != props.digitCount - 1) {
      otpCont.value.children[index + 1].focus();
    }
  }
  if (isDigitsFull()) {
    emit("update:otp", digits.join(""));
  }
};
</script>

<template>
  <div ref="otpCont" class="flex justify-center">
    <input
      inputmode="numeric"
      pattern="[0-9]*"
      required
      @keydown="handleKeyDown($event, ind)"
      type="password"
      class="digit-box focus:outline-none"
      v-for="(el, ind) in digits"
      :key="el + ind"
      v-model="digits[ind]"
      :autofocus="ind === 0"
      maxlength="1"
      :class="{ bounce: digits[ind] !== null }"
    />
  </div>
</template>

<style>
.digit-box {
  text-align: center;
  height: 4rem;
  width: 3rem;
  border: none;
  border-bottom: 1px solid;
  /* border-bottom: 2px solid rgb(74, 74, 74); */
  display: inline-block;
  border-radius: 0px;
  margin: 5px;
  padding: 0.5rem;
  font-size: 2rem;
  font-family: poppins;
  font-weight: 600;
}

input:focus {
  outline: none;
  box-shadow: none;
}

.digit-box:focus {
  outline: none;
  box-shadow: none;
  border: none;
  border-bottom: 1px solid #4635b1;
  /* caret-color: transparent; */
}
.bounce {
  animation: pulse 0.3s ease-in-out alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.1);
  }
}
</style>

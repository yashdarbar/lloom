import { create } from "zustand";

type ConfettiStore = {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void
}
//this how a custom hook is created
export const useConfettiStore = create<ConfettiStore>((set)=>({
    isOpen: false,
    onOpen: ()=> set({ isOpen: true}),
    onClose: ()=> set({ isOpen: false}),
})
)
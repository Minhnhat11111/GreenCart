import Address from "../models/Address.js"


export const addAddress = async (req,res) => {
try {
    const { address } = req.body
    const userId = req.userId
    await Address.create({ ...address, userId })
    res.json({success:true,message:"Thêm địa chỉ thành công"})
} catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
    
}
}

//get address api/address/get 
export const getAddress = async (req, res) => {
    try {
        const  userId  = req.userId
        const addresses = await Address.find({ userId })
        res.json({success:true ,  addresses })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

//xóa địa chỉ
export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        
        const address = await Address.findOneAndDelete({ _id: id, userId });
        
        if (!address) {
            return res.json({ success: false, message: "Địa chỉ không tồn tại" });
        }
        
        res.json({ success: true, message: "Xóa địa chỉ thành công" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

import { supabase } from "./supabaseClient";

export const createPartner = async (partnerData) => {
  try {
    console.log("[PartnerActions] createPartner payload:", partnerData);
    const { data, error } = await supabase
      .from("rdc_partners")
      .insert([partnerData])
      .select();
    
    if (error) {
      console.error("[PartnerActions] Supabase Insert Error:", error);
      throw error;
    }
    return data[0];
  } catch (err) {
    console.error("[PartnerActions] createPartner Exception:", err);
    throw err;
  }
};

export const updatePartner = async (id, partnerData) => {
  try {
    const { data, error } = await supabase
      .from("rdc_partners")
      .update(partnerData)
      .eq("id", id)
      .select();
    
    if (error) {
      console.error("[PartnerActions] Supabase Update Error:", error);
      throw error;
    }
    return data[0];
  } catch (err) {
    console.error("[PartnerActions] updatePartner Exception:", err);
    throw err;
  }
};

export const deletePartner = async (id) => {
  const { error } = await supabase.from("rdc_partners").delete().eq("id", id);
  if (error) throw error;
};

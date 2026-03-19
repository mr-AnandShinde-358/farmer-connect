import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFarmerDashboard, getFarmerProfile, upsertFarmerProfile } from "../api/farmer.api";

export function useGetFarmerProfile() {
  return useQuery({
    queryKey: ["farmerProfile"],
    queryFn: getFarmerProfile,
  });
}

export function useUpsertFarmerProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: upsertFarmerProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["farmerProfile"] }),
  });
}



export function useGetFarmerDashboard() {
  return useQuery({
    queryKey: ["farmerDashboard"],
    queryFn: getFarmerDashboard,
  });
}



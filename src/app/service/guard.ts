import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Api } from "./api";



export const patientOnlyGuard: CanActivateFn = (route, state) => {

  const apiService = inject(Api)
  const router = inject(Router)

  if (apiService.isPatient()) {
    return true;
  } else {
    router.navigate(['/login'])
    return false;
  }
}


export const doctorOnlyGuard: CanActivateFn = (route, state) => {

  const apiService = inject(Api)
  const router = inject(Router)

  if (apiService.isDoctor()) {
    return true;
  } else {
    router.navigate(['/login'])
    return false;
  }
}


export const authGuard: CanActivateFn = (route, state) => {

  const apiService = inject(Api)
  const router = inject(Router)

  if (apiService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login'])
    return false;
  }
}
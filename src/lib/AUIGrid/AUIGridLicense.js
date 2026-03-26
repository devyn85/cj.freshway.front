/*!
 * AUIGrid v3.0.16 License
 * Product ID : AUIGrid-EN-78033-524749-251027
 * Authorized Domain(or IP) : waylo.ifresh.co.kr
 * www.auisoft.net
 */

/*!
 * AUIGrid v3.0.16 License
 * License Type :  Enterprise Dev License
 * Authorized Domain(or IP) : wayloqa.ifresh.co.kr, waylodev.ifresh.co.kr, wayloset.ifresh.co.kr, 10.74.11.78
 * Expiration Date :  2026-04-30
 * www.auisoft.net
 */

var AUIGridLicense = "";

switch (import.meta.env.MODE) {
  case "prd": 
    AUIGridLicense = "eyJjdCI6IkIxZzQyZGt5T1BxK3JGZjJwNVwvaXU0Q0FzYkY1eHFINDg4dHpLWCtOeFwvK2VlT21aeVJXbStvcFwvMEUzeTR2NTBHaEpYRlhZNXBqRXFEcGo0b21CZmphK2VyaW1qTnFWNlF6V1dZYzJjc2F1UXA4UkRhaFR3TVZtdXNNdzlzMkxjOHVuS2hcLzQreUNOZlRsUTdlNE5BMmc9PSIsIml2IjoiMDAxNTRhMTQ1YzcwYmNmNDU4YzlkZmU5NWYwMzk2N2IiLCJzIjoiZWZlYjNlZjVkZmQzM2NmMSJ9"
    break;
  case "qa":
  case "dev":
  default:
    AUIGridLicense = "eyJjdCI6IjQxRlhEcjBUT0RwampraXNEaUoyZlpaTGRPWSs2K2s0NDNXMStFd1Nhc3RBMlhubEh1bmNmV1wvXC95ajV4ckh4NDBSOTBoR1E2cFRRcWU5VUNBTDJ6b3dNRUtqQ3BKTnFlRWVVSEMzcmdcL3pTZGVSYW4rbWJGdmpXakw0Sjlzb1ZnUm5PV0FFT2FtRzJrNStlVDdTeEFsZGpTMnRXUEZWeUdnR1pVZHBBM0NaNXNtVnRDbGNsVVhxOTN5OXd4aDZPb3huXC9NenlXVW9cL3VjUXJLdldUMCt0dz09IiwiaXYiOiI0MWUzOTVlMjc2OTUwZjZiMjUwNjc2ODE4ZjExNTFiMCIsInMiOiIwNmVjOGZiNWJjY2U4YWI1In0=";
    break;
}

if (typeof window !== "undefined") window.AUIGridLicense = AUIGridLicense;

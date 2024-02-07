// ** Third Party Imports
import axios from 'axios'
import Preview from "../../../views/dashboards/receipt/Preview";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {getSingleTransactionRequest} from "../../../store/apps/transaction";
import {useRouter} from "next/router";


const InvoicePreview = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if(router.isReady){
      dispatch(getSingleTransactionRequest(router?.query?.id))
    }
  },[router.isReady])

  return <Preview />
}

export default InvoicePreview

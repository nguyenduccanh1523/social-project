import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../actions/actions";
import { useEffect } from "react";
import Swal from "sweetalert2";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, msg, update } = useSelector((state) => state.root.auth || {});

  useEffect(() => {
    if (msg && update) {
      const icon = msg.includes("thành công") ? "success" : "error";
      const title = msg.includes("thành công") ? "Thành công!" : "Lỗi";
      
      Swal.fire({
        title: title,
        text: msg,
        icon: icon,
        confirmButtonText: "OK"
      }).then(() => {
        dispatch(actions.clearMessage());
      });
    }
  }, [msg, update, dispatch]);

  return (
    <>
    </>
  );
};

export default UserProfile; 
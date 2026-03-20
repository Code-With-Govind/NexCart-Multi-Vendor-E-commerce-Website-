import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate("/auth/login");
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }


  return (
    <div className="w-full space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Create Account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground font-medium">
          Already have an account?
          <Link
            className="font-bold ml-1.5 text-primary hover:text-primary/80 hover:underline transition-all"
            to="/auth/login"
          >
            Login here
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <p className="text-center text-sm text-muted-foreground mt-4 font-medium">
        Want to sell?
        <Link className="font-bold ml-1.5 text-primary hover:text-primary/80 hover:underline transition-all" to="/auth/register-seller">
          Register as a Seller
        </Link>
      </p>
    </div>
  );
}

export default AuthRegister;

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./Firebase";
import { toast } from "react-toastify";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import googleLogo from "../google.png"; // Import the image directly

function SignInwithGoogle() {
  const navigate = useNavigate();  // Initialize navigate for routing

  async function googleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;

        if (user) {
          // Split the displayName into first, middle, and last name if applicable
          const nameParts = user.displayName?.split(" ");
          const firstName = nameParts[0];
          const middleName = nameParts.length > 2 ? nameParts.slice(1, nameParts.length - 1).join(" ") : "";
          const lastName = nameParts[nameParts.length - 1] || "";

          // Store user info in Firestore
          const userRef = doc(db, "Users", user.uid);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            // If the user doesn't exist in Firestore, create the document
            await setDoc(userRef, {
              email: user.email,
              firstName,
              middleName,
              lastName,
              photo: user.photoURL,
              college: "",
              leetcode: "",
            });
          }

          // Fetch user data to check if 'college' and 'leetcode' are empty
          const userData = userDoc.data();
          if (!userData?.college || !userData?.leetcode) {
            navigate("/datainput");  // Redirect to data input page if empty
          } else {
            navigate("/dashboard");  // Redirect to dashboard if both fields are filled
          }

          toast.success("User logged in successfully", {
            position: "top-center",
          });
        }
      })
      .catch((error) => {
        console.log(error.message);
        toast.error("Google login failed", {
          position: "bottom-center",
        });
      });
  }

  return (
    <div className="text-center mt-4">
      <p className="text-gray-700 mb-2">-- Or continue with --</p>
      <div
        className="cursor-pointer mx-auto w-52 h-12 flex justify-center items-center bg-white border-gray-300"
        onClick={googleLogin}
      >
        <img
          src={googleLogo} // Use imported google logo here
          alt="Google Logo"
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default SignInwithGoogle;

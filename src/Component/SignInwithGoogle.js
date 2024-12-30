import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./Firebase";
import { toast } from "react-toastify";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; 

function SignInwithGoogle() {
  const navigate = useNavigate();

  function googleLogin() {
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
          await setDoc(doc(db, "Users", user.uid), {
            email: user.email,
            firstName,
            middleName,
            lastName,
            photo: user.photoURL,
          });

          // Check if the college and leetcode fields are empty
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            const college = userData.college || "";
            const leetcode = userData.leetcode || "";

            // If either field is empty, navigate to /datainput
            if (!college || !leetcode) {
              navigate("/datainput");
            } else {
              navigate("/dashboard");
            }
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
          src={googleLogo} 
          alt="Google Logo"
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default SignInwithGoogle;

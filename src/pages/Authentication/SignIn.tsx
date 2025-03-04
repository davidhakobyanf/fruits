import React, { useRef, useReducer } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useNavigate } from 'react-router-dom';

type State = {
  emailError: string | null;
  passwordError: string | null;
  generalError: string | null;
};

type Action =
  | { type: 'SET_EMAIL_ERROR'; payload: string | null }
  | { type: 'SET_PASSWORD_ERROR'; payload: string | null }
  | { type: 'SET_GENERAL_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERRORS' };

const initialState: State = {
  emailError: null,
  passwordError: null,
  generalError: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_EMAIL_ERROR':
      return { ...state, emailError: action.payload };
    case 'SET_PASSWORD_ERROR':
      return { ...state, passwordError: action.payload };
    case 'SET_GENERAL_ERROR':
      return { ...state, generalError: action.payload };
    case 'CLEAR_ERRORS':
      return initialState;
    default:
      return state;
  }
};

const SignIn: React.FC = () => {
  const mailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'CLEAR_ERRORS' });

    const email = mailRef.current?.value.trim();
    const password = passwordRef.current?.value.trim();

    // Проверка на пустые поля
    if (!email || !password) {
      if (!email) dispatch({ type: 'SET_EMAIL_ERROR', payload: 'Մուտքագրեք էլ. փոստի հասցեն' });
      if (!password) dispatch({ type: 'SET_PASSWORD_ERROR', payload: 'Մուտքագրեք գաղտնաբառը' });
      return;
    }

    try {
      const response = await fetch('https://api.mytoy.am/admin/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Մուտքն հաջողված է:', data);
        localStorage.setItem('token', data.token);
        navigate('/');
      } else if (response.status === 401) {
        dispatch({
          type: 'SET_GENERAL_ERROR',
          payload: 'Այդպիսի հաշիվ գոյություն չունի կամ դուք սխալ եք մուտքագրել էլ. փոստը կամ գաղտնաբառը',
        });
      } else {
        dispatch({
          type: 'SET_GENERAL_ERROR',
          payload: 'Այդպիսի հաշիվ գոյություն չունի կամ դուք սխալ եք մուտքագրել էլ. փոստը կամ գաղտնաբառը',
        });
      }
    } catch (error) {
      console.error('Սխալ առաջացավ:', error);
      dispatch({
        type: 'SET_GENERAL_ERROR',
        payload: 'Տեղի ունեցավ սխալ։ Խնդրում ենք կրկին փորձել։',
      });
    }
  };

  // Обработчики для очистки ошибок при вводе
  const handleEmailChange = () => {
    if (mailRef.current?.value.trim()) {
      dispatch({ type: 'SET_EMAIL_ERROR', payload: null });
    }
  };

  const handlePasswordChange = () => {
    if (passwordRef.current?.value.trim()) {
      dispatch({ type: 'SET_PASSWORD_ERROR', payload: null });
    }
  };

  return (
    <>
      <Breadcrumb pageName="" />
      <div className="h-[100vh] flex flex-wrap items-center">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-1/2 mx-auto -mt-24">
          <div className="flex flex-wrap items-center h-fit">
            <div className="w-full border-stroke dark:border-strokedark">
              <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                  Մուտք գործել Mytoy.am ադմին համակարգ
                </h2>

                <form onSubmit={login}>
                  {state.generalError && (
                    <p className="mb-4 text-red-500 text-sm">{state.generalError}</p>
                  )}

                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Էլ. փոստ
                    </label>
                    <div className="relative">
                      <input
                        ref={mailRef}
                        type="email"
                        placeholder="Մուտքագրեք ձեր էլ. փոստը"
                        onChange={handleEmailChange}
                        className={`w-full rounded-lg border ${state.emailError ? 'border-red-500' : 'border-stroke'} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                      />
                      {state.emailError && (
                        <p className="mt-1 text-red-500 text-sm">{state.emailError}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Գաղտնաբառ
                    </label>
                    <div className="relative">
                      <input
                        ref={passwordRef}
                        type="password"
                        placeholder="6+ նշաններ, 1 մեծատառ"
                        onChange={handlePasswordChange}
                        className={`w-full rounded-lg border ${state.passwordError ? 'border-red-500' : 'border-stroke'} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                      />
                      {state.passwordError && (
                        <p className="mt-1 text-red-500 text-sm">{state.passwordError}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-5">
                    <input
                      type="submit"
                      value="Մուտք գործել"
                      className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;

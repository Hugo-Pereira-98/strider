async function fetchWithToken(input: RequestInfo, init?: RequestInit) {
  const accessToken = localStorage.getItem('accessToken');
  if (init?.headers) {
    (init.headers as Record<string, string>)[
      'Authorization'
    ] = `Bearer ${accessToken}`;
  } else {
    init = {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }
  return fetch(process.env.NEXT_PUBLIC_APP_API_URL! + input, init);
}

export default fetchWithToken;

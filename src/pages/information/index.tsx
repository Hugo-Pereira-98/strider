import { useEffect, useState } from 'react';
import { Spinner } from '../../components/ui/Spinner';
import { UserLayout } from '../../layouts/UserLayout';
import { useToast } from '@/hooks/useToast';

export default function Information() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/posts'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);

        toast({
          title: 'Data loaded successfully',
          description: 'The list of posts has been loaded.',
        });
      } catch (error) {
        const errorMessage =
          (error as Error).message || 'An unknown error occurred.';

        toast({
          type: 'danger',
          title: 'Error loading data',
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <UserLayout>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-4">
        Information
      </h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.slice(0, 10).map((item) => (
            <button
              key={item.id}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                {item.title}
              </div>
            </button>
          ))}
        </div>
      )}
    </UserLayout>
  );
}

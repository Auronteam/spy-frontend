export const Spinner = () => (
    <div role="status" className="flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-300 border-t-blue-600" />
        <span className="sr-only">Loading</span>
    </div>
);

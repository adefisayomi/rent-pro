

// Helper function to generate price list
export const generatePriceList = (): { value: number; label: string }[] => {
    const prices: { value: number; label: string }[] = [{ value: 0, label: 'any' }];
  
    const addPrice = (price: number, label: string) => {
      prices.push({ value: price, label: `₦ ${label}` });
    };
  
    const ranges = [
      { max: 1000000, step: 100000 }, // 100,000 to 1 Million
      { max: 10000000, step: 1000000 }, // 1 Million to 10 Million
      { max: 100000000, step: 10000000 }, // 10 Million to 100 Million
      { max: 300000000, step: 50000000 }, // 100 Million to 300 Million
    ];
  
    ranges.forEach(({ max, step }) => {
      for (
        let price =
          prices.length === 0 ? 100000 : prices[prices.length - 1].value + step;
        price <= max;
        price += step
      ) {
        const formattedPrice =
          price >= 1000000
            ? `${(price / 1000000).toLocaleString()} Million`
            : `${price.toLocaleString()}`;
        addPrice(price, formattedPrice);
      }
    });
  
    return prices;
  };
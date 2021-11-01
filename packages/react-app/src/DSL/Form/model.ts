function model<T extends object>(obj: T, key: keyof T) {
  return {
    value: obj[key] as any,
    name: key as any,
    //@ts-ignore
    initialValue: obj[key] as any,
    onChange: (value: any) => {
      return (obj[key] = value);
    },
  };
}

export default model;

#include <stdio.h>
int main()
{
  float celsius, fahrenheit;
  printf("Input a Fahrenheit value: ");
  scanf("%f", &fahrenheit);
  celsius = (fahrenheit - 32) * 5 / 9;
  printf("Celsius: %.2f", celsius);
  return 0;
}

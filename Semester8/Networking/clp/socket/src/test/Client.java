import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;
import java.util.Scanner;

public class Client {
    public static void main(String[] args) throws IOException {
        Socket conn = new Socket("localhost", 5002);
        DataOutputStream out = new DataOutputStream(conn.getOutputStream());
        DataInputStream in = new DataInputStream(conn.getInputStream());

        while (true) {
            String line = in.readUTF();
            System.out.println(line);

            Scanner sc = new Scanner(System.in);
            String command = sc.nextLine();
            if (command.equalsIgnoreCase("exit")) {
                break;
            } else {
                out.writeUTF(command);
            }
        }

        try {
            out.close();
            in.close();
            conn.close();
        } catch (Exception e) {
        }
    }
}

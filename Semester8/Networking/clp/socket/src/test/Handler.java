import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;

public class Handler extends Thread {
    Socket conn;
    DataInputStream in;
    DataOutputStream out;

    public Handler(Socket conn, DataInputStream in, DataOutputStream out) {
        this.conn = conn;
        this.in = in;
        this.out = out;
    }

    @Override
    public void run() {
        while (true) {
            try {
                out.writeUTF("First Name: ");
                String fn = in.readUTF();
                out.writeUTF("Last Name: ");
                String ln = in.readUTF();
                String fullName = fn + " " + ln;
                out.writeUTF("Your full Name is :" + fullName);
            } catch (IOException e) {
                e.printStackTrace();
                break;
            }
        }

        try {
            this.in.close();
            this.out.close();
        } catch (Exception e) {
        }
    }
}

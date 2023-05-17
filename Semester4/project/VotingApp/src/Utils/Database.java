package Utils;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {
    public static void main(String args[]) {
        Connection conn = null;
        try {
            String url = "jdbc:postgresql://localhost:5432/votingapp";
            String user = "zahinafsar";
            String password = "zahin";
            // String url = "jdbc:postgresql://bndaojkwjdddwx26sq51-postgresql.services.clever-cloud.com:5432/bndaojkwjdddwx26sq51";
            // String user = "uza8gcjtli8wqebodl8d";
            // String password = "lTqtmeKYmwALtuooLJqbZ4LhhUOi7m";
            Class.forName("org.postgresql.Driver");
            conn = DriverManager.getConnection(url, user, password);
            System.out.println("Connected to the PostgreSQL server successfully.");
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException ex) {
                System.out.println(ex.getMessage());
            }
        }
    }
}